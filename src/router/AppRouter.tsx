import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CheckoutPage } from "../pages/CheckoutPage";
import { EntryPage } from "../pages/EntryPage";
import { MenuPage } from "../pages/MenuPage";
import { MerchantOrdersPage } from "../pages/MerchantOrdersPage";
import { OrderDetailPage } from "../pages/OrderDetailPage";
import { ScanPage } from "../pages/ScanPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/store/:storeId/menu" element={<MenuPage />} />
        <Route path="/store/:storeId/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
