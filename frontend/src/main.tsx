import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import CharacterSelectionPage from "./pages/CharacterSelectionPage/CharacterSelectionPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/select" element={<CharacterSelectionPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
