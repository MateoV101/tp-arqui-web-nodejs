const { body } = require('express-validator');

const nombreRule = body('nombre')
  .optional({ nullable: false })
  .isString().withMessage('nombre debe ser texto')
  .trim()
  .notEmpty().withMessage('nombre es requerido')
  .isLength({ max: 100 }).withMessage('nombre debe tener máximo 100 caracteres');

const descripcionRule = body('descripcion')
  .optional({ nullable: true })
  .isString().withMessage('descripcion debe ser texto');

const stockRule = body('stock')
  .optional({ nullable: false })
  .isInt({ min: 0 }).withMessage('stock debe ser un entero >= 0')
  .toInt();

const precioRule = body('precio')
  .optional({ nullable: false })
  .isFloat({ gt: 0 }).withMessage('precio debe ser un número > 0')
  .toFloat();

exports.validateCreate = [
  body('nombre').exists().withMessage('nombre es requerido'),
  nombreRule,
  descripcionRule,
  body('stock').exists().withMessage('stock es requerido'),
  stockRule,
  body('precio').exists().withMessage('precio es requerido'),
  precioRule,
];

exports.validateUpdate = [
  nombreRule,
  descripcionRule,
  stockRule,
  precioRule,
];


