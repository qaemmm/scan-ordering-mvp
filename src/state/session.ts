import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderMode, SessionContext } from "../types/domain";

type SessionState = SessionContext & {
  setMode: (mode: OrderMode) => void;
  setStoreId: (storeId: string) => void;
  setTableNo: (tableNo?: string) => void;
  setAddressId: (addressId?: string) => void;
  setPickupTime: (pickupTime?: string) => void;
  applyScanContext: (context: SessionContext) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      storeId: "s_1001",
      mode: "DELIVERY",
      tableNo: undefined,
      addressId: undefined,
      pickupTime: undefined,
      setMode: (mode) =>
        set((state) => ({
          mode,
          tableNo: mode === "DINE_IN" ? state.tableNo : undefined,
          addressId: mode === "DELIVERY" ? state.addressId : undefined,
          pickupTime: mode === "PICKUP" ? state.pickupTime : undefined,
        })),
      setStoreId: (storeId) => set({ storeId }),
      setTableNo: (tableNo) => set({ tableNo }),
      setAddressId: (addressId) => set({ addressId }),
      setPickupTime: (pickupTime) => set({ pickupTime }),
      applyScanContext: (context) =>
        set({
          storeId: context.storeId,
          mode: context.mode,
          tableNo: context.mode === "DINE_IN" ? context.tableNo : undefined,
          addressId: context.mode === "DELIVERY" ? context.addressId : undefined,
          pickupTime: context.mode === "PICKUP" ? context.pickupTime : undefined,
        }),
    }),
    {
      name: "ordering-session",
    },
  ),
);
