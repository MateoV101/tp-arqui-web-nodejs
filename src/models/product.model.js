const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.01,
    },
  },
}, {
  tableName: 'products',
  timestamps: true,
});

Product.prototype.toJSON = function () {
  const values = { ...this.get() };
  if (values.createdAt) {
    values.createdAt = values.createdAt.toISOString();
  }
  if (values.updatedAt) {
    values.updatedAt = values.updatedAt.toISOString();
  }
  return values;
};

module.exports = Product;

