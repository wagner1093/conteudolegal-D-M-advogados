"use client";

export default function AdminHeader() {
  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      style={{
        height: "52px",
        minHeight: "52px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 0 3px rgba(34,197,94,0.18)",
          }}
        />
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>
          Sistema operacional
        </span>
      </div>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#b0b8c8", textTransform: "capitalize" }}>
        {dateStr}
      </span>
    </header>
  );
}
