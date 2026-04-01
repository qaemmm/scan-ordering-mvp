import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "antd-mobile/es/global";
import App from "./App";
import "./index.css";

async function enableMocking() {
  const shouldEnableMock =
    import.meta.env.DEV || String(import.meta.env.VITE_ENABLE_MSW).toLowerCase() === "true";
  if (!shouldEnableMock) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
