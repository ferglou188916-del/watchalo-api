const db = require('../db');
const cols = 'id, codigo, nombre, genero, duracion, clasificacion, sala, precio, estado, imagenUrl, fecha, hora';
const required = ['codigo', 'nombre', 'genero', 'duracion', 'clasificacion', 'sala', 'precio', 'estado'];
function check(p) {
  if (required.some(k => p[k] === undefined || p[k] === null || String(p[k]).trim() === '')) return 'Faltan campos obligatorios';
  if (typeof p.codigo !== 'string' || !p.codigo.trim() || typeof p.nombre !== 'string' || !p.nombre.trim()) return 'Código y nombre inválidos';
  if (!Number.isFinite(Number(p.precio)) || Number(p.precio) < 0) return 'El precio debe ser un número no negativo';
  if (!Number.isInteger(Number(p.duracion)) || Number(p.duracion) <= 0) return 'La duración debe ser un entero positivo';
  if (!['Disponible', 'No disponible'].includes(p.estado)) return 'Estado inválido';
  if (p.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(p.fecha)) return 'Fecha inválida';
  if (p.hora && !/^\d{2}:\d{2}$/.test(p.hora)) return 'Hora inválida';
  return null;
}
function error(res, e) {
  if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'El código de película ya existe' });
  console.error(e); return res.status(500).json({ message: 'Error de base de datos' });
}
const values = p => [p.codigo.trim(), p.nombre.trim(), p.genero, Number(p.duracion), p.clasificacion, p.sala, Number(p.precio), p.estado, p.imagenUrl || '', p.fecha || null, p.hora || null];
exports.listar = async (_req, res) => { try { const [rows] = await db.query(`SELECT ${cols} FROM peliculas ORDER BY id DESC`); res.json(rows); } catch (e) { error(res,e); } };
exports.detalle = async (req, res) => { try { const [rows] = await db.query(`SELECT ${cols} FROM peliculas WHERE id = ?`, [req.params.id]); if (!rows.length) return res.status(404).json({message:'Película no encontrada'}); res.json(rows[0]); } catch(e) { error(res,e); } };
exports.crear = async (req, res) => { const p = req.body || {}; const invalid = check(p); if (invalid) return res.status(400).json({message:invalid}); try { const [result] = await db.query('INSERT INTO peliculas (codigo,nombre,genero,duracion,clasificacion,sala,precio,estado,imagenUrl,fecha,hora) VALUES (?,?,?,?,?,?,?,?,?,?,?)', values(p)); const [rows] = await db.query(`SELECT ${cols} FROM peliculas WHERE id=?`,[result.insertId]); res.status(201).json(rows[0]); } catch(e) { error(res,e); } };
exports.actualizar = async (req, res) => { const p = req.body || {}; const invalid = check(p); if (invalid) return res.status(400).json({message:invalid}); try { const [result] = await db.query('UPDATE peliculas SET codigo=?,nombre=?,genero=?,duracion=?,clasificacion=?,sala=?,precio=?,estado=?,imagenUrl=?,fecha=?,hora=? WHERE id=?',[...values(p),req.params.id]); if (!result.affectedRows) return res.status(404).json({message:'Película no encontrada'}); const [rows] = await db.query(`SELECT ${cols} FROM peliculas WHERE id=?`,[req.params.id]); res.json(rows[0]); } catch(e) { error(res,e); } };
exports.eliminar = async (req,res) => { try { const [result] = await db.query('DELETE FROM peliculas WHERE id=?',[req.params.id]); if (!result.affectedRows) return res.status(404).json({message:'Película no encontrada'}); res.json({message:'Película eliminada'}); } catch(e) { if(e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({message:'La película tiene reservas asociadas y no se puede eliminar; cámbiala a No disponible'}); error(res,e); } };
