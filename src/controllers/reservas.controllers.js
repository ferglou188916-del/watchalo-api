const db = require('../db');
const cols = 'r.id, r.codigo, r.usuario_id, r.pelicula_id, r.nombre_cliente, r.funcion, r.asientos, r.cantidad, r.total, r.utilizado, r.fecha_compra, p.nombre AS pelicula_nombre, p.sala AS sala';
const joined = `SELECT ${cols} FROM reservas r JOIN peliculas p ON p.id=r.pelicula_id`;
const json = r => ({...r, asientos: r.asientos.split(','), utilizado: Boolean(r.utilizado)});
function fail(res, err) { console.error(err); return res.status(500).json({message:'Error de base de datos'}); }
exports.listar = async (req,res) => { try {
 const args=[]; const where=[];
 if(req.query.pelicula_id!==undefined) { if(!Number.isSafeInteger(Number(req.query.pelicula_id)) || Number(req.query.pelicula_id)<1) return res.status(400).json({message:'pelicula_id inválido'}); where.push('r.pelicula_id=?'); args.push(req.query.pelicula_id); }
 if(req.query.funcion!==undefined) {where.push('r.funcion=?');args.push(req.query.funcion);}
 if(req.query.usuario_id!==undefined) {where.push('r.usuario_id=?');args.push(req.query.usuario_id);}
 const [rows] = await db.query(`${joined} ${where.length ? 'WHERE '+where.join(' AND ') : ''} ORDER BY r.fecha_compra DESC`,args);
 res.json(rows.map(json));
} catch(e) {fail(res,e);} };
exports.detalle = async (req,res) => { try {const [rows]=await db.query(`${joined} WHERE r.id=?`,[req.params.id]); if(!rows.length)return res.status(404).json({message:'Reserva no encontrada'});res.json(json(rows[0]));} catch(e){fail(res,e);} };
exports.crear = async (req,res) => {
 const p=req.body||{};
 const id=Number(p.pelicula_id),usuario=Number(p.usuario_id);
 const seats=Array.isArray(p.asientos)?p.asientos:p.asientos?.split(',');
 if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(usuario)||usuario<1||typeof p.nombre_cliente!=='string'||!p.nombre_cliente.trim()||typeof p.funcion!=='string'||!p.funcion.trim()||!Array.isArray(seats)||!seats.length||!seats.every(s=>typeof s==='string'&&/^[A-Z]{1,2}[1-9][0-9]?$/.test(s))||new Set(seats).size!==seats.length) return res.status(400).json({message:'Datos de compra o asientos inválidos'});
 const connection=await db.getConnection();
 try {
  await connection.beginTransaction();
  const [movies]=await connection.query('SELECT * FROM peliculas WHERE id=? FOR UPDATE',[id]);
  if(!movies.length) {await connection.rollback();return res.status(404).json({message:'Película no encontrada'});}
  if(movies[0].estado!=='Disponible') {await connection.rollback();return res.status(409).json({message:'Película no disponible'});}
  const [users]=await connection.query('SELECT id FROM usuarios WHERE id=?',[usuario]);
  if(!users.length) {await connection.rollback();return res.status(400).json({message:'Usuario genérico inválido'});}
  const [existing]=await connection.query('SELECT asientos FROM reservas WHERE pelicula_id=? AND funcion=?',[id,p.funcion]);
  const occupied=new Set(existing.flatMap(r=>r.asientos.split(',')));
  if(seats.some(s=>occupied.has(s))) {await connection.rollback();return res.status(409).json({message:'Uno o más asientos ya están ocupados'});}
  const amount=seats.length;
  const total=Number((Number(movies[0].precio)*amount).toFixed(2));
  const code=`WAC-${require('crypto').randomUUID().replace(/-/g,'').slice(0,16).toUpperCase()}`;
  const [insert]=await connection.query('INSERT INTO reservas (codigo,usuario_id,pelicula_id,nombre_cliente,funcion,asientos,cantidad,total) VALUES (?,?,?,?,?,?,?,?)',[code,usuario,id,p.nombre_cliente.trim(),p.funcion,seats.join(','),amount,total]);
  await connection.commit();
  const [rows]=await db.query(`${joined} WHERE r.id=?`,[insert.insertId]);
  res.status(201).json(json(rows[0]));
 } catch(e){await connection.rollback();fail(res,e);} finally {connection.release();}
};
exports.validar = async (req,res) => {try {const [result]=await db.query('UPDATE reservas SET utilizado=1 WHERE codigo=? AND utilizado=0',[req.params.codigo]);if(result.affectedRows)return res.json({message:'Boleto validado correctamente',codigo:req.params.codigo,utilizado:true});const [rows]=await db.query('SELECT utilizado FROM reservas WHERE codigo=?',[req.params.codigo]);if(!rows.length)return res.status(404).json({message:'Boleto no encontrado'});return res.status(409).json({message:'Este boleto ya fue utilizado'});}catch(e){fail(res,e);} };
