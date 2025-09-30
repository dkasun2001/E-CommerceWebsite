class CartManager {
  constructor() {
    this.updateBadge();
  }

  getCartItems() {
    if (document.cookie.indexOf(',counter=') >= 0) {
      const items = document.cookie.split(',')[0].split('=')[1].split(' ').filter(item => item);
      return items;
    }
    return [];
  }

  getCartCount() {
    if (document.cookie.indexOf(',counter=') >= 0) {
      return Number(document.cookie.split(',')[1].split('=')[1]);
    }
    return 0;
  }

  addToCart(productId) {
    let order = productId + " ";
    let counter = 1;

    if (document.cookie.indexOf(',counter=') >= 0) {
      order = productId + " " + document.cookie.split(',')[0].split('=')[1];
      counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
    }

    document.cookie = "orderId=" + order + ",counter=" + counter;
    this.updateBadge();
    return counter;
  }

  clearCart() {
    document.cookie = "orderId=0,counter=0";
    this.updateBadge();
  }

  updateBadge() {
    const badge = document.getElementById('badge');
    if (badge) {
      const counter = this.getCartCount();
      badge.innerHTML = counter;
    }
  }

  getCartSummary() {
    const items = this.getCartItems();
    const itemCounts = {};

    items.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    return Object.entries(itemCounts).map(([id, count]) => ({
      productId: id,
      quantity: count
    }));
  }
}

const cartManager = new CartManager();