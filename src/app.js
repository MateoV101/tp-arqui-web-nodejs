const express = require('express');
const path = require('path');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());

// Archivos estáticos
app.use('/common', express.static(path.join(__dirname, '..', 'public', 'common'))); // CSS/JS comunes
app.use('/static', express.static(path.join(__dirname, '..', 'public', 'static'))); // Imágenes u otros binarios

// Rutas del frontend
app.get('/', (req, res) => {
  res.redirect('/stock/dashboard');
});

app.get('/stock/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard', 'index.html'));
});

app.get('/stock/report', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'report', 'index.html'));
});

// API
app.use('/api', apiRouter);

// 404
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.redirect('/stock/dashboard');
  }
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', message: err.message });
});

module.exports = app;

