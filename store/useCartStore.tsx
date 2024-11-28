import { create } from 'zustand';

interface CartItem {
  id: number;
  product_name: string;
  product_price: number;
  const_product_price: number;
  quantity: number;
  promotion_qty: number;
  const_promotion_qty_per_product: number;
  const_crate_qty: number;
}

interface CartState {
  cart: CartItem[];
  increaseQuantity: (item: CartItem) => void;
  decreaseQuantity: (id: number, unit_price: number) => void;
  getTotalQuantity: () => number;
  getTotalCrateFee: () => number;
  getSubTotal: () => number;
  getGrandTotal: () => number;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  increaseQuantity: item =>
    set(state => {
      const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map(cartItem =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + 1,
                  promotion_qty: cartItem.promotion_qty + item.const_promotion_qty_per_product,
                  product_price: cartItem.product_price + item.product_price,
                }
              : cartItem
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  decreaseQuantity: (id, unit_price) =>
    set(state => {
      const existingItem = state.cart.find(cartItem => cartItem.id === id);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return {
            cart: state.cart.map(cartItem =>
              cartItem.id === id
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity - 1,
                    promotion_qty: cartItem.promotion_qty - existingItem.const_promotion_qty_per_product,
                    product_price: cartItem.product_price - unit_price,
                  }
                : cartItem
            ),
          };
        } else {
          return {
            cart: state.cart.filter(cartItem => cartItem.id !== id),
          };
        }
      }
      return state;
    }),

  getTotalQuantity: () => {
    const state = get();
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalCrateFee: () => {
    const state = get();
    return state.cart.reduce(
      (total, item) =>
        total +
        (item.const_crate_qty + item.const_promotion_qty_per_product) *
          item.quantity *
          Number(process.env.NEXT_PUBLIC_CRATE_PRICE || 30000),
      // 30000,
      0
    );
  },
  getSubTotal: () => {
    const state = get();
    // return state.cart.reduce((total, item) => total + item.product_price, 0);
    return state.cart.reduce((total, item) => total + item.const_product_price * item.quantity, 0);
  },
  getGrandTotal: () => {
    const state = get();
    return state.getTotalCrateFee() + state.getSubTotal();
  },
  resetCart: () => set({ cart: [] }),
}));
