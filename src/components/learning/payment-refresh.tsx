"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function PaymentRefresh() {
  const router = useRouter();
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count++;
      router.refresh();
      if (count >= 15) {
        clearInterval(timer);
        setWaiting(false);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [router]);
  return (
    <div className="mt-5 text-sm">
      <p role="status" className="text-muted-foreground">
        {waiting
          ? "Checking for payment confirmation..."
          : "Confirmation is taking longer than usual. Check again or contact support; do not pay twice."}
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-3 text-primary underline"
      >
        Check payment status
      </button>
    </div>
  );
}
