"use client";
import { useState } from "react";
export function Transcript({ text }: { text: string }) {
  const [search, setSearch] = useState("");
  const paragraphs = text.split(/\n+/).filter(Boolean);
  const query = search.trim().toLowerCase();
  const visible = query
    ? paragraphs.filter((p) => p.toLowerCase().includes(query))
    : paragraphs;
  return (
    <details className="mt-6 border-y border-border py-4">
      <summary className="cursor-pointer font-semibold">Transcript</summary>
      <label className="mt-4 block text-sm">
        Search transcript
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 block w-full rounded border border-border bg-background px-3 py-2"
        />
      </label>
      <div className="mt-4 max-h-80 space-y-3 overflow-auto text-sm leading-7">
        {visible.length ? (
          visible.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>No matching text.</p>
        )}
      </div>
    </details>
  );
}
