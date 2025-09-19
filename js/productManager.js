class ProductManager {
  constructor() {
    this.baseURL = window.location.origin;
    this.products = [];
    this.filteredProducts = [];
    this.currentFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      isAccessory: ''
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadProducts();
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Filter controls
    this.setupFilterControls();
  }

  setupFilterControls() {
    // Create filter panel if it doesn't exist
    if (!document.getElementById('filterPanel')) {
      this.createFilterPanel();
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentFilters.category = e.target.value;
        this.applyFilters();
      });
    }

    // Price filters
    const minPriceFilter = document.getElementById('minPriceFilter');
    const maxPriceFilter = document.getElementById('maxPriceFilter');
    
    if (minPriceFilter) {
      minPriceFilter.addEventListener('input', (e) => {
        this.currentFilters.minPrice = e.target.value;
        this.applyFilters();
      });
    }

    if (maxPriceFilter) {
      maxPriceFilter.addEventListener('input', (e) => {
        this.currentFilters.maxPrice = e.target.value;
        this.applyFilters();
      });
    }

    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.currentFilters.isAccessory = e.target.value;
        this.applyFilters();
      });
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }

  createFilterPanel() {
    const filterPanel = document.createElement('div');
    filterPanel.id = 'filterPanel';
    filterPanel.className = 'filter-panel';
    filterPanel.innerHTML = `
      <h3>Filters</h3>
      <div class="filter-group">
        <label for="categoryFilter">Category:</label>
        <select id="categoryFilter">
          <option value="">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="typeFilter">Type:</label>
        <select id="typeFilter">
          <option value="">All Types</option>
          <option value="false">Clothing</option>
          <option value="true">Accessories</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="minPriceFilter">Min Price:</label>
        <input type="number" id="minPriceFilter" placeholder="0" min="0" step="0.01">
      </div>
      
      <div class="filter-group">
        <label for="maxPriceFilter">Max Price:</label>
        <input type="number" id="maxPriceFilter" placeholder="1000" min="0" step="0.01">
      </div>
      
      <button id="clearFilters" class="clear-filters-btn">Clear Filters</button>
    `;

    // Insert filter panel before main content
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
      mainContainer.insertBefore(filterPanel, mainContainer.firstChild);
    }
  }

  async loadProducts() {
    try {
      const response = await fetch(`${this.baseURL}/api/products`);
      if (response.ok) {
        this.products = await response.json();
        this.filteredProducts = [...this.products];
        this.renderProducts();
      } else {
        console.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (this.currentFilters.category && product.category !== this.currentFilters.category) {
        return false;
      }

      // Type filter (isAccessory)
      if (this.currentFilters.isAccessory !== '') {
        const isAccessory = this.currentFilters.isAccessory === 'true';
        if (product.isAccessory !== isAccessory) return false;
      }

      // Price filters
      if (this.currentFilters.minPrice && product.price < parseFloat(this.currentFilters.minPrice)) {
        return false;
      }

      if (this.currentFilters.maxPrice && product.price > parseFloat(this.currentFilters.maxPrice)) {
        return false;
      }

      return true;
    });

    this.renderProducts();
  }

  clearFilters() {
    this.currentFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      isAccessory: ''
    };

    // Reset form inputs
    document.getElementById('input').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('minPriceFilter').value = '';
    document.getElementById('maxPriceFilter').value = '';

    this.filteredProducts = [...this.products];
    this.renderProducts();
  }

  renderProducts() {
    const containerClothing = document.getElementById('containerClothing');
    const containerAccessories = document.getElementById('containerAccessories');

    if (containerClothing) containerClothing.innerHTML = '';
    if (containerAccessories) containerAccessories.innerHTML = '';

    this.filteredProducts.forEach(product => {
      const productElement = this.createProductElement(product);
      
      if (product.isAccessory && containerAccessories) {
        containerAccessories.appendChild(productElement);
      } else if (!product.isAccessory && containerClothing) {
        containerClothing.appendChild(productElement);
      }
    });

    // Update product count
    this.updateProductCount();
  }

  createProductElement(product) {
    const boxDiv = document.createElement('div');
    boxDiv.id = 'box';

    const boxLink = document.createElement('a');
    boxLink.href = `/contentDetails.html?${product.id}`;

    const imgTag = document.createElement('img');
    imgTag.src = product.preview;
    imgTag.alt = product.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    const h3 = document.createElement('h3');
    h3.textContent = product.name;

    const h4 = document.createElement('h4');
    h4.textContent = product.brand;

    const h2 = document.createElement('h2');
    h2.textContent = `Rs ${product.price}`;

    // Add admin controls if user is authenticated
    if (authManager.isAuthenticated()) {
      const adminControls = document.createElement('div');
      adminControls.className = 'admin-controls';
      adminControls.innerHTML = `
        <button onclick="productManager.editProduct(${product.id})" class="edit-btn">Edit</button>
        <button onclick="productManager.deleteProduct(${product.id})" class="delete-btn">Delete</button>
      `;
      detailsDiv.appendChild(adminControls);
    }

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    return boxDiv;
  }

  updateProductCount() {
    const clothingCount = this.filteredProducts.filter(p => !p.isAccessory).length;
    const accessoryCount = this.filteredProducts.filter(p => p.isAccessory).length;

    // Update section headers with counts
    const clothingHeader = document.querySelector('h1');
    const accessoryHeader = document.querySelectorAll('h1')[1];

    if (clothingHeader) {
      clothingHeader.textContent = `clothing for men and women (${clothingCount})`;
    }
    if (accessoryHeader) {
      accessoryHeader.textContent = `accessories for men and women (${accessoryCount})`;
    }
  }

  async deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${this.baseURL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...authManager.getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        authManager.showMessage('Product deleted successfully', 'success');
        this.loadProducts(); // Reload products
      } else {
        const data = await response.json();
        authManager.showMessage(data.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      authManager.showMessage('Network error', 'error');
    }
  }

  editProduct(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;

    this.showProductModal(product);
  }

  showAddProductModal() {
    this.showProductModal();
  }

  showProductModal(product = null) {
    const isEdit = !!product;
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h2>${isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <form id="productForm">
          <input type="text" name="name" placeholder="Product Name" value="${product?.name || ''}" required>
          <input type="text" name="brand" placeholder="Brand" value="${product?.brand || ''}" required>
          <input type="number" name="price" placeholder="Price" value="${product?.price || ''}" step="0.01" required>
          <textarea name="description" placeholder="Description">${product?.description || ''}</textarea>
          <input type="url" name="preview" placeholder="Preview Image URL" value="${product?.preview || ''}" required>
          <textarea name="photos" placeholder="Additional Photos (JSON array)">${product?.photos ? JSON.stringify(product.photos) : '[]'}</textarea>
          <select name="category">
            <option value="clothing" ${product?.category === 'clothing' ? 'selected' : ''}>Clothing</option>
            <option value="accessories" ${product?.category === 'accessories' ? 'selected' : ''}>Accessories</option>
          </select>
          <label>
            <input type="checkbox" name="isAccessory" ${product?.isAccessory ? 'checked' : ''}> Is Accessory
          </label>
          <input type="number" name="stock" placeholder="Stock Quantity" value="${product?.stock || 0}" min="0">
          <button type="submit">${isEdit ? 'Update' : 'Add'} Product</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('productForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isEdit) {
        this.updateProduct(product.id, new FormData(form));
      } else {
        this.addProduct(new FormData(form));
      }
      modal.remove();
    });
  }

  async addProduct(formData) {
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
      preview: formData.get('preview'),
      photos: JSON.parse(formData.get('photos') || '[]'),
      category: formData.get('category'),
      isAccessory: formData.has('isAccessory'),
      stock: parseInt(formData.get('stock')) || 0
    };

    try {
      const response = await fetch(`${this.baseURL}/api/products`, {
        method: 'POST',
        headers: {
          ...authManager.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        authManager.showMessage('Product added successfully', 'success');
        this.loadProducts();
      } else {
        const data = await response.json();
        authManager.showMessage(data.error || 'Failed to add product', 'error');
      }
    } catch (error) {
      authManager.showMessage('Network error', 'error');
    }
  }

  async updateProduct(id, formData) {
    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
      preview: formData.get('preview'),
      photos: JSON.parse(formData.get('photos') || '[]'),
      category: formData.get('category'),
      isAccessory: formData.has('isAccessory'),
      stock: parseInt(formData.get('stock')) || 0
    };

    try {
      const response = await fetch(`${this.baseURL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          ...authManager.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        authManager.showMessage('Product updated successfully', 'success');
        this.loadProducts();
      } else {
        const data = await response.json();
        authManager.showMessage(data.error || 'Failed to update product', 'error');
      }
    } catch (error) {
      authManager.showMessage('Network error', 'error');
    }
  }
}

// Initialize product manager
const productManager = new ProductManager();