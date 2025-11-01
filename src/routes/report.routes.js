const express = require('express');
const controller = require('../controllers/report.controller');

const router = express.Router();

router.get('/inventory', controller.getInventoryReport);

module.exports = router;

