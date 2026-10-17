"use client";

import { useEffect, useState } from "react";

export function PwaRegistrar() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkConnection = () => {
      fetch("/api/health", { cache: "no-store", signal: AbortSignal.timeout(8000) })
        .then((response) => { if (mounted) setOffline(!response.ok); })
        .catch(() => { if (mounted) setOffline(true); });
    };
    const handleOnline = checkConnection;
    const handleOffline = checkConnection;
    if (!navigator.onLine) checkConnection();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    return () => {
      mounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary bg-black px-4 py-3 text-center text-sm text-foreground shadow-[0_-18px_48px_rgba(0,107,255,0.18)]">
      Connection interrupted. Public pages and the app shell may stay available, but private data and payments need a connection.
    </div>
  );
}
