# TP Arquitectura Web — Node.js/Express

Aplicación de gestión de productos e inventario. Incluye frontend en HTML/CSS/JS, API REST, base de datos SQLite y test funcionales y unitarios.

### Stack
- **Backend:** Node.js, Express
- **Persistencia:** SQLite (Sequelize ORM)
- **Frontend:** Vanilla JS, HTML5, CSS3
- **Testing:** Jest + Supertest
- **Validación:** express-validator

---

## 1) Funcionalidad
- **Frontend (Req 1.0):**
  - **CRUD (Req 1.1):** Dashboard (`/stock/dashboard`).
  - **Reporte (Req 1.2):** Reportes (`/stock/report`).
- **Backend (Req 2.0):**
  - **API REST Nivel 2 (Req 2.1):** bajo `/api`.
  - **Datos de test (Req 2.2):** `npm run init:db` carga 20 productos.
- **Testing (Req 3.0):**
  - **Endpoints (Req 3.1):** funcionales + unitarios.
- **Build (Req 4.0):**
  - README y scripts npm (Req 4.1).

---

## 2) Instalación y ejecución
Requisitos: Node.js ≥ 18 y npm.

1. Instalar dependencias:
```bash
npm install
```
2. Inicializar base de datos (crea `db/dev.db` y carga datos):
```bash
npm run init:db
```
3. Ejecutar en desarrollo (nodemon):
```bash
npm run dev
```
   Producción:
```bash
npm start
```
4. Acceso frontend:
- Dashboard: `http://127.0.0.1:5000/stock/dashboard`
- Reportes: `http://127.0.0.1:5000/stock/report`

Assets:
- CSS/JS comunes: `/common` → `public/common`

---

## 3) Configuración (variables de entorno)
- **PORT**: puerto del servidor (default 5000)
- **DB_STORAGE**: ruta del archivo SQLite (default `db/dev.db`)
- **DEFAULT_PAGE_SIZE**: tamaño de página por defecto (default 10)
- **MAX_PAGE_SIZE**: tamaño máximo de página (default 100)

Ejemplo (PowerShell):
```powershell
$env:PORT=5001; $env:DB_STORAGE="db/dev.db"; npm run dev
```

Los tests usan SQLite en memoria (`DB_STORAGE=':memory:'`) configurado en `tests/setup.js`.

---

## 4) Scripts npm
- `start`: inicia servidor (`node src/index.js`)
- `dev`: servidor con recarga (`nodemon src/index.js`)
- `init:db`: crea tablas y seed (`node src/scripts/initDb.js`)
- `test`: ejecuta Jest + Supertest

---

## 5) API REST (Req 2.1)
Base: `/api`

- **Salud**
  - GET `/api/ping` → `{ "message": "pong" }`

- **Productos** (`/api/v1/product`)
  - GET `/` — lista paginada
    - Query: `page` (≥1), `per_page` (1..MAX), `nombre` (filtro parcial)
    - Respuesta ejemplo:
```json
{
  "products": [{"id":1,"nombre":"...","stock":10,"precio":99.99}],
  "pagination": {"page":1,"per_page":10,"total_items":20,"total_pages":2,"has_next":true,"has_prev":false}
}
```
  - POST `/` — crea producto (Body: `{ nombre, stock, precio, descripcion? }`)
  - GET `/:id` — obtiene por ID
  - PUT `/:id` — actualiza (requiere body no vacío)
  - DELETE `/:id` — elimina

- **Reportes** (`/api/v1/report`)
  - GET `/inventory` — métricas y lista de bajo stock
    - Query: `low_stock_threshold` (default 10), `page`, `per_page`

Ejemplos:
```bash
curl http://127.0.0.1:5000/api/ping
curl "http://127.0.0.1:5000/api/v1/product?page=1&per_page=5&nombre=Mouse"
curl -X POST http://127.0.0.1:5000/api/v1/product -H "Content-Type: application/json" -d '{"nombre":"Nuevo","stock":10,"precio":99.99}'
```

---

## 6) Estructura del proyecto
```
public/
  common/
    app.js
    styles.css
  static/
    (imágenes u otros archivos estáticos)
  dashboard/
    index.html
  report/
    index.html
src/
  app.js
  index.js
  config/
    config.js
    database.js
  controllers/
    product.controller.js
    report.controller.js
  middleware/
    validation.js
  models/
    product.model.js
  routes/
    index.js
    product.routes.js
    report.routes.js
  scripts/
    initDb.js
tests/
  functional/
    ping/ping.test.js
    product/crud.test.js
    report/inventory.test.js
  unit/
    controllers/product.controller.test.js
    middleware/validation.test.js
    models/product.model.test.js
```

---

## 7) Testing
Ejecutar todo:
```bash
npm test
```
Estructura:
- Funcionales (endpoints): `tests/functional/...`
- Unitarios (modelo, middleware, controller): `tests/unit/...`

---

## 8) Errores y validaciones
- 404 en API: `{ error: "Endpoint no encontrado" }`
- 500 global: `{ error, message }`
- Validación (400): `{ error: 'Datos de entrada inválidos', details: [...] }`

---



