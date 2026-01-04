"use client";

import { useEffect } from "react";

interface ViewCounterProps {
  pageId: string;
}

export default function ViewCounter({ pageId }: ViewCounterProps) {
  useEffect(() => {
    // View Counter async triggern (fire and forget)
    const trackView = async () => {
      try {
        await fetch("/api/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId })
        });
      } catch (e) {
        // Fehler ignorieren - View Tracking ist nicht kritisch
        console.error("View tracking failed:", e);
      }
    };

    trackView();
  }, [pageId]);

  // Keine visuelle Ausgabe
  return null;
}
