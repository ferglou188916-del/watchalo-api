const express = require('express');
const cors = require('cors');
const peliculasRoutes = require('./routes/peliculas.routes');
const reservasRoutes = require('./routes/reservas.routes');
const app = express();
app.use(cors());
app.use(express.json({ limit: '128kb' }));
app.get('/', (_req, res) => res.json({ message: 'API Watchalo activa' }));
app.use('/peliculas', peliculasRoutes);
app.use('/reservas', reservasRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ message: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});
module.exports = app;
