import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* // Initialize global toast notifications using Sonner
        // - richColors: enables gradient-based toasts
        // - closeButton: adds manual dismissal option
        // For customization, see: https://sonner.emilkowal.ski */}
    <Toaster richColors closeButton />
  </StrictMode>
);
