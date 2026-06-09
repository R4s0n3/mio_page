import { cartSchema, type Cart } from "./cart-schema";

export type { Cart, CartItem } from "./cart-schema";

const CART_STORAGE_KEY = "mio_cart";

export const cartUtils = {
  // Get cart from localStorage
  getCart(): Cart {
    if (typeof window === "undefined") return { items: [] };

    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return { items: [] };

      const parsedCart: unknown = JSON.parse(stored);
      const result = cartSchema.safeParse(parsedCart);

      return result.success ? result.data : { items: [] };
    } catch {
      return { items: [] };
    }
  },

  // Save cart to localStorage
  saveCart(cart: Cart): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Silently fail if localStorage is full
    }
  },

  // Add item to cart
  addToCart(
    product: {
      id: string;
      name: string;
      price: number;
      image?: string;
      typeName?: string;
    },
    quantity: number,
    size?: string,
  ): void {
    const cart = this.getCart();

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === product.id && item.size === size,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const existingItem = cart.items[existingItemIndex];
      if (existingItem) {
        existingItem.quantity += quantity;
      }
    } else {
      // Add new item
      cart.items.push({
        id: `${product.id}_${size ?? "default"}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        typeName: product.typeName,
        size,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    this.saveCart(cart);
  },

  // Remove item from cart
  removeFromCart(itemId: string): void {
    const cart = this.getCart();
    cart.items = cart.items.filter((item) => item.id !== itemId);
    this.saveCart(cart);
  },

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find((item) => item.id === itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart(cart);
      }
    }
  },

  // Clear cart
  clearCart(): void {
    this.saveCart({ items: [] });
  },

  // Get total items count
  getTotalItems(): number {
    const cart = this.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get total price
  getTotalPrice(): number {
    const cart = this.getCart();
    return cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  },
};
