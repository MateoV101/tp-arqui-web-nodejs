const { Sequelize } = require('sequelize');
const config = require('./config');

// Crea la instancia de Sequelize a partir de la configuración actual
function createSequelize() {
  const db = config.DB;
  if (db.dialect === 'sqlite') {
    return new Sequelize({ dialect: 'sqlite', storage: db.storage, logging: false });
  }
  // Soporte básico para otros dialectos si se configuran por ENV en el futuro
  // Nota: para MySQL se requiere dependencia 'mysql2'
  return new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
  });
}

const sequelize = createSequelize();

module.exports = { sequelize };

