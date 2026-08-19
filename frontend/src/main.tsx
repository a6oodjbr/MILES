import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import "./i18n";
import router from "./routes/router";
import { clerkAppearance } from "./features/auth/styles/clerkAppearance.styles";
import { clerkPublishableKey } from "./features/auth/utils/clerkConfig";
import SplashScreen from "./components/splashScreen/splashScreen";

const SPLASH_DURATION_MS = 2900;

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowSplash(false),
      SPLASH_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      appearance={clerkAppearance}
      publishableKey={clerkPublishableKey}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);
