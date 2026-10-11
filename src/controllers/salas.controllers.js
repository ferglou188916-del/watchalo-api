const db = require('../db');
const normalize = name => typeof name === 'string' ? name.trim().toUpperCase() : '';
const validar = p => {
  const nombre = normalize(p.nombre);
  const filas = Number(p.filas);
  if (!nombre || nombre.length > 60 || !Number.isInteger(filas) || filas < 1 || filas > 20) return null;
  return { nombre, filas };
};
const fallo = (res, e) => {
  if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({message:'Ya existe una sala con ese nombre'});
  console.error(e);
  return res.status(500).json({message:'Error al consultar las salas'});
};
exports.listar = async (_req,res) => { try {
  const [rows] = await db.query('SELECT id,nombre,filas FROM salas ORDER BY id');
  res.json(rows);
} catch(e) { fallo(res,e); } };
exports.crear = async (req,res) => {
  const item=validar(req.body||{});
  if(!item)return res.status(400).json({message:'Nombre o filas inválidos (1 a 20)'});
  try {
    const [r]=await db.query('INSERT INTO salas (nombre,filas) VALUES (?,?)',[item.nombre,item.filas]);
    res.status(201).json({id:r.insertId,...item});
  } catch(e){fallo(res,e);}
};
exports.actualizar = async (req,res) => {
  const item=validar(req.body||{});
  if(!item)return res.status(400).json({message:'Nombre o filas inválidos (1 a 20)'});
  try {
    const [rows]=await db.query('SELECT id,nombre,filas FROM salas WHERE id=?',[req.params.id]);
    if(!rows.length)return res.status(404).json({message:'Sala no encontrada'});
    const original=rows[0];
    const [movies]=await db.query('SELECT id FROM peliculas WHERE UPPER(TRIM(sala))=UPPER(?) LIMIT 1',[original.nombre]);
    if(movies.length && item.nombre!==original.nombre)return res.status(409).json({message:'La sala tiene películas asignadas; reasígnalas antes de cambiar el nombre'});
    const [reservas]=await db.query('SELECT asientos FROM reservas WHERE UPPER(SUBSTRING_INDEX(funcion, ?, 1))=UPPER(?)',[ '|', original.nombre]);
    const abecedario='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(reservas.some(r=>r.asientos.split(',').some(a=>abecedario.indexOf(a.match(/^[A-Z]+/)?.[0]||'')>=item.filas)))return res.status(409).json({message:'No puedes reducir la sala: existen asientos vendidos fuera de las nuevas filas'});
    await db.query('UPDATE salas SET nombre=?,filas=? WHERE id=?',[item.nombre,item.filas,original.id]);
    res.json({id:original.id,...item});
  }catch(e){fallo(res,e);}
};
exports.eliminar = async (req,res) => { try {
  const [rows]=await db.query('SELECT id,nombre FROM salas WHERE id=?',[req.params.id]);
  if(!rows.length)return res.status(404).json({message:'Sala no encontrada'});
  const nombre=rows[0].nombre;
  const [movies]=await db.query('SELECT id FROM peliculas WHERE UPPER(TRIM(sala))=UPPER(?) LIMIT 1',[nombre]);
  const [sales]=await db.query('SELECT id FROM reservas WHERE UPPER(SUBSTRING_INDEX(funcion, ?, 1))=UPPER(?) LIMIT 1',['|',nombre]);
  if(movies.length||sales.length)return res.status(409).json({message:'La sala tiene funciones o ventas. Reasigna las películas y conserva el historial antes de eliminarla'});
  await db.query('DELETE FROM salas WHERE id=?',[rows[0].id]);
  res.json({message:'Sala eliminada'});
 }catch(e){fallo(res,e);} };
