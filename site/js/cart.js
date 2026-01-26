/**
 * Shopping Cart Module
 * Manages cart state with localStorage persistence
 */

const STORAGE_KEY = 'jockblock-cart';

export class Cart {
  constructor() {
    this.items = [];
    this._load();
  }

  /**
   * Load cart from localStorage
   * @private
   */
  _load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.items = data.items || [];
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      this.items = [];
    }
  }

  /**
   * Save cart to localStorage
   * @private
   */
  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: this.items }));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }

  /**
   * Add item to cart
   * @param {string} id - Product ID
   * @param {number} quantity - Quantity to add
   * @param {number} price - Unit price
   */
  addItem(id, quantity, price) {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    if (price <= 0) {
      throw new Error('Price must be positive');
    }

    const existingItem = this.items.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ id, quantity, price });
    }

    this._save();
  }

  /**
   * Remove item from cart
   * @param {string} id - Product ID to remove
   */
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this._save();
    }
  }

  /**
   * Update quantity for an item
   * @param {string} id - Product ID
   * @param {number} quantity - New quantity (0 to remove)
   */
  updateQuantity(id, quantity) {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    if (quantity === 0) {
      this.removeItem(id);
      return;
    }

    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = quantity;
      this._save();
    }
  }

  /**
   * Get cart total
   * @returns {number} Total price rounded to 2 decimal places
   */
  getTotal() {
    const total = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Round to 2 decimal places to avoid floating point issues
    return Math.round(total * 100) / 100;
  }

  /**
   * Get total item count
   * @returns {number} Total quantity of all items
   */
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Get item by ID
   * @param {string} id - Product ID
   * @returns {Object|undefined} Item or undefined if not found
   */
  getItem(id) {
    return this.items.find(item => item.id === id);
  }

  /**
   * Clear all items from cart
   */
  clear() {
    this.items = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Check if cart is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get serializable cart data
   * @returns {Object} Cart data with items, total, and itemCount
   */
  toJSON() {
    return {
      items: [...this.items],
      total: this.getTotal(),
      itemCount: this.getItemCount()
    };
  }
}

// Singleton instance for global use
let cartInstance = null;

export function getCart() {
  if (!cartInstance) {
    cartInstance = new Cart();
  }
  return cartInstance;
}

export default Cart;
