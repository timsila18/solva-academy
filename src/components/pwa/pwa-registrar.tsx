"use client";

import { useEffect, useState } from "react";

export function PwaRegistrar() {
  const [offline, setOffline] = useState(() => (typeof navigator === "undefined" ? false : !navigator.onLine));

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    return () => {
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
