// Estado global de la aplicación
const state = {
  currentPage: 1,
  perPage: 10,
  searchQuery: '',
  editingProductId: null,
  reportPage: 1,
  reportPerPage: 10,
};

const API_BASE = '/api/v1';
const PRODUCT_API = `${API_BASE}/product`;
const REPORT_API = `${API_BASE}/report`;

function toggleLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.toggle('hidden', !show);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
}

async function fetchAPI(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  return data;
}

async function loadProducts() {
  try {
    toggleLoading(true);
    const params = new URLSearchParams({ page: state.currentPage, per_page: state.perPage });
    if (state.searchQuery) params.append('nombre', state.searchQuery);
    const data = await fetchAPI(`${PRODUCT_API}?${params}`);
    renderProducts(data.products);
    renderPagination(data.pagination);
  } catch (error) {
    showToast('Error al cargar productos: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

function renderProducts(products) {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-state-icon">📦</div>
          <p>No se encontraron productos</p>
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td><strong>${escapeHtml(product.nombre)}</strong></td>
      <td>${escapeHtml(product.descripcion || '-')}</td>
      <td><span class="stock-badge ${product.stock < 10 ? 'stock-low' : 'stock-normal'}">${product.stock} unidades</span></td>
      <td>${formatCurrency(product.precio)}</td>
      <td class="actions">
        <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">🗑️ Eliminar</button>
      </td>
    </tr>`).join('');
}

function renderPagination(pagination) {
  const container = document.getElementById('pagination');
  if (!container) return;
  container.innerHTML = `
    <button ${!pagination.has_prev ? 'disabled' : ''} onclick="changePage(${pagination.page - 1})">← Anterior</button>
    <span class="page-info">Página ${pagination.page} de ${pagination.total_pages} (${pagination.total_items} productos)</span>
    <button ${!pagination.has_next ? 'disabled' : ''} onclick="changePage(${pagination.page + 1})">Siguiente →</button>`;
}

function changePage(page) {
  state.currentPage = page;
  loadProducts();
}

function searchProducts() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  state.searchQuery = searchInput.value.trim();
  state.currentPage = 1;
  loadProducts();
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  state.searchQuery = '';
  state.currentPage = 1;
  loadProducts();
}

function openAddProductModal() {
  state.editingProductId = null;
  document.getElementById('modal-title').textContent = 'Agregar Producto';
  document.getElementById('product-form').reset();
  document.getElementById('product-modal').classList.add('active');
}

async function editProduct(productId) {
  try {
    toggleLoading(true);
    const product = await fetchAPI(`${PRODUCT_API}/${productId}`);
    state.editingProductId = productId;
    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('product-nombre').value = product.nombre;
    document.getElementById('product-descripcion').value = product.descripcion || '';
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-precio').value = product.precio;
    document.getElementById('product-modal').classList.add('active');
  } catch (error) {
    showToast('Error al cargar producto: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
  document.getElementById('product-form').reset();
  state.editingProductId = null;
}

async function saveProduct(event) {
  event.preventDefault();
  const formData = {
    nombre: document.getElementById('product-nombre').value.trim(),
    descripcion: document.getElementById('product-descripcion').value.trim() || null,
    stock: parseInt(document.getElementById('product-stock').value),
    precio: parseFloat(document.getElementById('product-precio').value),
  };
  try {
    toggleLoading(true);
    if (state.editingProductId) {
      await fetchAPI(`${PRODUCT_API}/${state.editingProductId}`, { method: 'PUT', body: JSON.stringify(formData) });
      showToast('Producto actualizado exitosamente');
    } else {
      await fetchAPI(`${PRODUCT_API}`, { method: 'POST', body: JSON.stringify(formData) });
      showToast('Producto creado exitosamente');
    }
    closeModal();
    loadProducts();
  } catch (error) {
    showToast('Error al guardar producto: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

async function deleteProduct(productId) {
  if (!confirm('¿Está seguro de eliminar este producto?')) return;
  try {
    toggleLoading(true);
    await fetchAPI(`${PRODUCT_API}/${productId}`, { method: 'DELETE' });
    showToast('Producto eliminado exitosamente');
    loadProducts();
  } catch (error) {
    showToast('Error al eliminar producto: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

async function loadReport(page = 1) {
  try {
    toggleLoading(true);
    state.reportPage = page;
    const params = new URLSearchParams({ page: state.reportPage, per_page: state.reportPerPage });
    const report = await fetchAPI(`${REPORT_API}/inventory?${params}`);
    document.getElementById('report-total-products').textContent = report.total_products;
    document.getElementById('report-total-items').textContent = report.total_items_in_stock;
    document.getElementById('report-total-value').textContent = formatCurrency(report.total_inventory_value);
    document.getElementById('report-low-stock-count').textContent = report.low_stock_count;
    renderLowStockProducts(report.low_stock_products);
    renderReportPagination(report.pagination);
  } catch (error) {
    showToast('Error al cargar reporte: ' + error.message, 'error');
  } finally {
    toggleLoading(false);
  }
}

function renderLowStockProducts(products) {
  const tbody = document.getElementById('low-stock-tbody');
  if (!tbody) return;
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <div class="empty-state-icon">✅</div>
          <p>No hay productos con stock bajo</p>
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td><strong>${escapeHtml(product.nombre)}</strong></td>
      <td><span class="stock-badge stock-low">${product.stock} unidades</span></td>
      <td>${formatCurrency(product.precio)}</td>
    </tr>`).join('');
}

function renderReportPagination(pagination) {
  const container = document.getElementById('report-pagination');
  if (!container) return;
  container.innerHTML = `
    <button ${!pagination.has_prev ? 'disabled' : ''} onclick="changeReportPage(${pagination.page - 1})">← Anterior</button>
    <span class="page-info">Página ${pagination.page} de ${pagination.total_pages} (${pagination.total_items} con stock bajo)</span>
    <button ${!pagination.has_next ? 'disabled' : ''} onclick="changeReportPage(${pagination.page + 1})">Siguiente →</button>`;
}

function changeReportPage(page) {
  loadReport(page);
}

function initializePage() {
  const path = window.location.pathname;
  if (path === '/stock/report') {
    loadReport();
  } else if (path === '/stock/dashboard') {
    loadProducts();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function init() {
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) addProductBtn.addEventListener('click', openAddProductModal);
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.addEventListener('click', searchProducts);
  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearSearch);
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchProducts(); });
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  const productForm = document.getElementById('product-form');
  if (productForm) productForm.addEventListener('submit', saveProduct);
  const productModal = document.getElementById('product-modal');
  if (productModal) productModal.addEventListener('click', (e) => { if (e.target.id === 'product-modal') closeModal(); });
  const refreshReportBtn = document.getElementById('refresh-report-btn');
  if (refreshReportBtn) refreshReportBtn.addEventListener('click', () => loadReport());
  initializePage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.changePage = changePage;
window.changeReportPage = changeReportPage;
