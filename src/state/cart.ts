import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/domain";

type AddPayload = Omit<CartItem, "id" | "qty" | "subtotal">;

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (payload: AddPayload) => void;
  changeQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  markHydrated: () => void;
};

function makeCartItemId(payload: AddPayload): string {
  const sortedAddonIds = [...payload.addonIds].sort();
  return [payload.productId, payload.specId, sortedAddonIds.join(",")].join("|");
}

function calcSubtotal(unitPrice: number, qty: number): number {
  return Number((unitPrice * qty).toFixed(2));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      addItem: (payload) =>
        set((state) => {
          const id = makeCartItemId(payload);
          const existing = state.items.find((item) => item.id === id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      qty: item.qty + 1,
                      subtotal: calcSubtotal(item.unitPrice, item.qty + 1),
                    }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...payload,
                id,
                qty: 1,
                subtotal: calcSubtotal(payload.unitPrice, 1),
              },
            ],
          };
        }),
      changeQty: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== id) return item;
              const nextQty = item.qty + delta;
              if (nextQty <= 0) return null;
              return {
                ...item,
                qty: nextQty,
                subtotal: calcSubtotal(item.unitPrice, nextQty),
              };
            })
            .filter(Boolean) as CartItem[],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set({ items: [] }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "ordering-cart",
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<{ items: CartItem[] }>) ?? {};
        const persistedItems = Array.isArray(persisted.items) ? persisted.items : [];
        const hasRuntimeItems = currentState.items.length > 0;

        return {
          ...currentState,
          ...(persistedState as object),
          // Avoid hydration race: if user already added items in memory, keep them.
          items: hasRuntimeItems ? currentState.items : persistedItems,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

export function getCartTotal(items: CartItem[]): number {
  return Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.qty, 0);
}
