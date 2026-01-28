/**
 * Cart Module Tests - TDD RED Phase
 * These tests define the expected behavior of the cart before implementation.
 */

import { Cart } from '../../js/cart.js';

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
    localStorage.clear();
  });

  describe('initialization', () => {
    test('starts with empty items array', () => {
      expect(cart.items).toEqual([]);
    });

    test('loads existing cart from localStorage', () => {
      localStorage.setItem('jockblock-cart', JSON.stringify({
        items: [{ id: 'jockblock-100ml', quantity: 2, price: 19.99 }]
      }));

      const loadedCart = new Cart();
      expect(loadedCart.items).toHaveLength(1);
      expect(loadedCart.items[0].quantity).toBe(2);
    });
  });

  describe('addItem', () => {
    test('adds new item to empty cart', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({
        id: 'jockblock-100ml',
        quantity: 1,
        price: 19.99
      });
    });

    test('increments quantity for existing item', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.addItem('jockblock-100ml', 2, 19.99);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    test('adds different items separately', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.addItem('jockblock-120ml', 1, 29.99);

      expect(cart.items).toHaveLength(2);
    });

    test('persists to localStorage', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);

      const stored = JSON.parse(localStorage.getItem('jockblock-cart'));
      expect(stored.items).toHaveLength(1);
      expect(stored.items[0].id).toBe('jockblock-100ml');
    });

    test('rejects invalid quantity', () => {
      expect(() => cart.addItem('jockblock-100ml', 0, 19.99))
        .toThrow('Quantity must be at least 1');
      expect(() => cart.addItem('jockblock-100ml', -1, 19.99))
        .toThrow('Quantity must be at least 1');
    });

    test('rejects invalid price', () => {
      expect(() => cart.addItem('jockblock-100ml', 1, -5))
        .toThrow('Price must be positive');
      expect(() => cart.addItem('jockblock-100ml', 1, 0))
        .toThrow('Price must be positive');
    });
  });

  describe('removeItem', () => {
    test('removes item from cart', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.removeItem('jockblock-100ml');

      expect(cart.items).toHaveLength(0);
    });

    test('does nothing for non-existent item', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.removeItem('non-existent');

      expect(cart.items).toHaveLength(1);
    });

    test('persists removal to localStorage', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.removeItem('jockblock-100ml');

      const stored = JSON.parse(localStorage.getItem('jockblock-cart'));
      expect(stored.items).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    test('updates quantity for existing item', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.updateQuantity('jockblock-100ml', 5);

      expect(cart.items[0].quantity).toBe(5);
    });

    test('removes item when quantity set to 0', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.updateQuantity('jockblock-100ml', 0);

      expect(cart.items).toHaveLength(0);
    });

    test('rejects negative quantities', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);

      expect(() => cart.updateQuantity('jockblock-100ml', -1))
        .toThrow('Quantity cannot be negative');
    });

    test('does nothing for non-existent item', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.updateQuantity('non-existent', 5);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(1);
    });

    test('persists update to localStorage', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.updateQuantity('jockblock-100ml', 3);

      const stored = JSON.parse(localStorage.getItem('jockblock-cart'));
      expect(stored.items[0].quantity).toBe(3);
    });
  });

  describe('getTotal', () => {
    test('returns 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });

    test('calculates total for single item', () => {
      cart.addItem('jockblock-100ml', 2, 19.99);

      expect(cart.getTotal()).toBeCloseTo(39.98, 2);
    });

    test('calculates total for multiple items', () => {
      cart.addItem('jockblock-100ml', 2, 19.99);
      cart.addItem('jockblock-120ml', 1, 29.99);

      expect(cart.getTotal()).toBeCloseTo(69.97, 2);
    });

    test('handles floating point precision', () => {
      cart.addItem('item1', 1, 0.1);
      cart.addItem('item2', 1, 0.2);

      // 0.1 + 0.2 should equal 0.3, not 0.30000000000000004
      expect(cart.getTotal()).toBeCloseTo(0.3, 2);
    });
  });

  describe('getItemCount', () => {
    test('returns 0 for empty cart', () => {
      expect(cart.getItemCount()).toBe(0);
    });

    test('returns quantity for single item', () => {
      cart.addItem('jockblock-100ml', 3, 19.99);

      expect(cart.getItemCount()).toBe(3);
    });

    test('returns total quantity across all items', () => {
      cart.addItem('jockblock-100ml', 2, 19.99);
      cart.addItem('jockblock-120ml', 3, 29.99);

      expect(cart.getItemCount()).toBe(5);
    });
  });

  describe('getItem', () => {
    test('returns item by id', () => {
      cart.addItem('jockblock-100ml', 2, 19.99);

      const item = cart.getItem('jockblock-100ml');
      expect(item).toEqual({
        id: 'jockblock-100ml',
        quantity: 2,
        price: 19.99
      });
    });

    test('returns undefined for non-existent item', () => {
      expect(cart.getItem('non-existent')).toBeUndefined();
    });
  });

  describe('clear', () => {
    test('empties cart', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.addItem('jockblock-120ml', 2, 29.99);
      cart.clear();

      expect(cart.items).toHaveLength(0);
    });

    test('removes cart from localStorage', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);
      cart.clear();

      expect(localStorage.getItem('jockblock-cart')).toBeNull();
    });
  });

  describe('isEmpty', () => {
    test('returns true for empty cart', () => {
      expect(cart.isEmpty()).toBe(true);
    });

    test('returns false when cart has items', () => {
      cart.addItem('jockblock-100ml', 1, 19.99);

      expect(cart.isEmpty()).toBe(false);
    });
  });

  describe('toJSON', () => {
    test('returns serializable cart data', () => {
      cart.addItem('jockblock-100ml', 2, 19.99);

      const json = cart.toJSON();
      expect(json).toEqual({
        items: [{ id: 'jockblock-100ml', quantity: 2, price: 19.99 }],
        total: 39.98,
        itemCount: 2
      });
    });
  });
});
