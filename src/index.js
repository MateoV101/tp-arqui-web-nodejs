const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await sequelize.sync();
    console.log('Base de datos sincronizada.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://127.0.0.1:${PORT}`);
      console.log(`📋 Dashboard: http://127.0.0.1:${PORT}/stock/dashboard`);
      console.log(`📈 Reportes: http://127.0.0.1:${PORT}/stock/report`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

main();

