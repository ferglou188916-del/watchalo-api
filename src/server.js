const app = require('./app');
const pool = require('./db');
const { port } = require('./config');
(async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(port, '0.0.0.0', () => console.log(`API Watchalo escuchando en puerto ${port}`));
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message);
    process.exit(1);
  }
})();
