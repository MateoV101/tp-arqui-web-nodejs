const { sequelize } = require('../config/database');
const Product = require('../models/product.model');

const sampleProducts = [
  { nombre: "Laptop HP Pavilion 15", descripcion: "Laptop con procesador Intel Core i5, 8GB RAM, 512GB SSD", stock: 25, precio: 899.99 },
  { nombre: "Mouse Logitech MX Master 3", descripcion: "Mouse inalámbrico ergonómico con sensor de alta precisión", stock: 50, precio: 99.99 },
  { nombre: "Teclado Mecánico RGB", descripcion: "Teclado mecánico con switches Cherry MX Blue e iluminación RGB", stock: 8, precio: 129.99 },
  { nombre: "Monitor LG 27'' 4K", descripcion: "Monitor 4K UHD con HDR10 y 60Hz", stock: 15, precio: 449.99 },
  { nombre: "Auriculares Sony WH-1000XM5", descripcion: "Auriculares con cancelación de ruido activa y hasta 30h de batería", stock: 5, precio: 349.99 },
  { nombre: "Silla Ergonómica Herman Miller", descripcion: "Silla de oficina con soporte lumbar ajustable", stock: 12, precio: 1299.99 },
  { nombre: "Escritorio Ajustable Standing Desk", descripcion: "Escritorio con altura eléctrica ajustable de 60-125cm", stock: 8, precio: 599.99 },
  { nombre: "Lámpara LED de Escritorio", descripcion: "Lámpara con temperatura de color ajustable y puerto USB", stock: 35, precio: 49.99 },
  { nombre: "Webcam Logitech C920", descripcion: "Webcam Full HD 1080p con micrófono estéreo", stock: 3, precio: 79.99 },
  { nombre: "Hub USB-C 7 en 1", descripcion: "Adaptador multipuerto con HDMI, USB 3.0 y lector SD", stock: 42, precio: 45.99 },
  { nombre: "Cable HDMI 2.1 Premium", descripcion: "Cable HDMI 8K de 2 metros con soporte para 120Hz", stock: 100, precio: 24.99 },
  { nombre: "Mousepad Gaming XL", descripcion: "Alfombrilla de ratón extendida 90x40cm con base antideslizante", stock: 67, precio: 19.99 },
  { nombre: "Licencia Microsoft Office 365", descripcion: "Suscripción anual a Office 365 Personal", stock: 200, precio: 69.99 },
  { nombre: "Antivirus Norton 360", descripcion: "Protección completa para hasta 5 dispositivos", stock: 150, precio: 49.99 },
  { nombre: "SSD Samsung 1TB NVMe", descripcion: "Unidad de estado sólido con velocidades de hasta 3500MB/s", stock: 30, precio: 119.99 },
  { nombre: "Disco Duro Externo 2TB", descripcion: "Disco duro portátil USB 3.0 con respaldo automático", stock: 6, precio: 79.99 },
  { nombre: "Pendrive USB 3.0 128GB", descripcion: "Memoria USB de alta velocidad con diseño compacto", stock: 4, precio: 22.99 },
  { nombre: "Consola PlayStation 5", descripcion: "Consola de última generación con lector de discos", stock: 2, precio: 499.99 },
  { nombre: "Control Xbox Wireless", descripcion: "Control inalámbrico compatible con PC y Xbox", stock: 45, precio: 59.99 },
  { nombre: "Tarjeta Gráfica RTX 4060", descripcion: "GPU NVIDIA con 8GB GDDR6 y Ray Tracing", stock: 7, precio: 329.99 }
];

async function initDatabase() {
  console.log("🔨 Inicializando base de datos...");
  try {
    await sequelize.sync({ force: true });
    console.log("✅ Tablas creadas exitosamente");

    await Product.bulkCreate(sampleProducts);
    console.log(`✅ ${sampleProducts.length} productos de ejemplo agregados`);

    const lowStock = sampleProducts.filter(p => p.stock < 10).length;
    console.log(`   📊 Productos con stock bajo (<10): ${lowStock}`);
    console.log("✅ Base de datos lista\n");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

initDatabase();


