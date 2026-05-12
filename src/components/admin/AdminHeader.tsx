import { useSite } from "@/context/SiteContext";
import { ChevronDown, Globe } from "lucide-react";

export default function AdminHeader() {
  const { sites, selectedSiteId, setSelectedSiteId } = useSite();

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
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* Site Selector */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            padding: "6px", 
            background: "rgba(30,41,59,0.05)", 
            borderRadius: "8px",
            color: "#1e293b"
          }}>
            <Globe size={16} />
          </div>
          <select
            value={selectedSiteId || ""}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            style={{
              appearance: "none",
              background: "transparent",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1e293b",
              cursor: "pointer",
              paddingRight: "20px",
              outline: "none"
            }}
          >
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 0, pointerEvents: "none", color: "#64748b" }} />
        </div>

        <div style={{ height: "16px", width: "1px", background: "#e2e8f0" }} />

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
      </div>
      
      <span style={{ fontSize: "11px", fontWeight: 500, color: "#b0b8c8", textTransform: "capitalize" }}>
        {dateStr}
      </span>
    </header>
  );
}
