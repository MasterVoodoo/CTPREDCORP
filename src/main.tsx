import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import App from "./App.tsx";
import AdminApp from "./AdminApp.tsx";
import "./index.css";

function Root() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Check if we're on admin route
      if (path.startsWith('/admin') || hash.startsWith('#admin-')) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    // Check initial route
    checkRoute();

    // Listen for route changes
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  return isAdminRoute ? <AdminApp /> : <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);