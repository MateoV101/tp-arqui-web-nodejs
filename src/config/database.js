const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const config = require('./config');

function createSequelize() {
  const storagePath = config.DB_STORAGE;

  if (storagePath && storagePath !== ':memory:') {
    const dir = path.dirname(storagePath);
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (_) {
    }
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

const sequelize = createSequelize();

module.exports = { sequelize };

