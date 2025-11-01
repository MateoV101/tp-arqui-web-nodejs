const path = require('path');

module.exports = {
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '10', 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  DB_STORAGE: process.env.DB_STORAGE || path.join(__dirname, '..', '..', 'db', 'dev.db'),
};

