import { useState } from "react";
import { Search, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";

type Event = { id: string; timestamp: string; type: "sale" | "restock" | "adjustment" | "waste"; item: string; qty: number; unit: string; note: string; user: string; value: number };

const EVENTS: Event[] = [
  { id: "e001", timestamp: "Jun 12 — 11:42 AM", type: "sale",       item: "Caramel Latte",         qty: -3,  unit: "cups",  note: "Morning rush",                      user: "Jamie R.",  value: -21.00  },
  { id: "e002", timestamp: "Jun 12 — 11:38 AM", type: "sale",       item: "Glazed Donut",           qty: -6,  unit: "pcs",   note: "Combo order",                       user: "Jamie R.",  value: -15.00  },
  { id: "e003", timestamp: "Jun 12 — 10:55 AM", type: "waste",      item: "Croissant",              qty: -2,  unit: "pcs",   note: "Overcooked batch",                  user: "Alex T.",   value: -9.00   },
  { id: "e004", timestamp: "Jun 12 — 10:30 AM", type: "restock",    item: "Whole Milk",             qty: 12,  unit: "gal",   note: "Delivery received",                 user: "Alex T.",   value: 54.00   },
  { id: "e005", timestamp: "Jun 12 — 09:14 AM", type: "adjustment", item: "Oat Milk",               qty: -1,  unit: "L",     note: "Count correction",                  user: "Manager",   value: -3.20   },
  { id: "e006", timestamp: "Jun 12 — 09:00 AM", type: "restock",    item: "Espresso Beans",         qty: 5,   unit: "kg",    note: "Mountain Roasters delivery",        user: "Alex T.",   value: 110.00  },
  { id: "e007", timestamp: "Jun 11 — 06:45 PM", type: "sale",       item: "Cold Brew",              qty: -8,  unit: "cups",  note: "Afternoon close",                   user: "Sam K.",    value: -56.00  },
  { id: "e008", timestamp: "Jun 11 — 05:20 PM", type: "sale",       item: "Matcha Latte",           qty: -5,  unit: "cups",  note: "Happy hour",                        user: "Sam K.",    value: -40.00  },
  { id: "e009", timestamp: "Jun 11 — 03:00 PM", type: "restock",    item: "Caramel Sauce",          qty: 12,  unit: "btl",   note: "Sweet Depot ORD-2839",              user: "Manager",   value: 114.00  },
  { id: "e010", timestamp: "Jun 11 — 02:15 PM", type: "waste",      item: "Glazed Donut",           qty: -4,  unit: "pcs",   note: "End of day write-off",              user: "Sam K.",    value: -10.00  },
  { id: "e011", timestamp: "Jun 11 — 11:00 AM", type: "adjustment", item: "Napkins",                qty: -50, unit: "pcs",   note: "Counted short in stockroom",        user: "Manager",   value: -1.00   },
  { id: "e012", timestamp: "Jun 10 — 08:00 AM", type: "restock",    item: "Flour (AP)",             qty: 25,  unit: "kg",    note: "Weekly staples order",              user: "Alex T.",   value: 45.00   },
  { id: "e013", timestamp: "Jun 10 — 07:45 AM", type: "restock",    item: "Granulated Sugar",       qty: 20,  unit: "kg",    note: "Weekly staples order",              user: "Alex T.",   value: 24.00   },
  { id: "e014", timestamp: "Jun 9 — 04:30 PM",  type: "sale",       item: "Donut 6-Pack",           qty: -7,  unit: "boxes", note: "Sunday afternoon bulk",             user: "Jamie R.",  value: -98.00  },
  { id: "e015", timestamp: "Jun 9 — 10:00 AM",  type: "restock",    item: "Vanilla Extract",        qty: 6,   unit: "btl",   note: "Sweet Depot delivery",              user: "Manager",   value: 72.00   },
];

const TYPE: Record<Event["type"], { label: string; color: string; bg: string }> = {
  sale:       { label: "Sale",       color: "#2563eb", bg: "#eff6ff" },
  restock:    { label: "Restock",    color: "#16a34a", bg: "#f0fdf4" },
  adjustment: { label: "Adjustment", color: "#d97706", bg: "#fffbeb" },
  waste:      { label: "Waste",      color: "#dc2626", bg: "#fef2f2" },
};

export function History() {
  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState<"all" | Event["type"]>("all");

  const filtered = EVENTS.filter((e) =>
    (e.item.toLowerCase().includes(search.toLowerCase()) || e.note.toLowerCase().includes(search.toLowerCase()) || e.user.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "all" || e.type === typeFilter)
  );

  const totalIn    = EVENTS.filter((e) => e.qty > 0).reduce((s, e) => s + e.value, 0);
  const totalOut   = EVENTS.filter((e) => e.qty < 0).reduce((s, e) => s + Math.abs(e.value), 0);
  const wasteTotal = EVENTS.filter((e) => e.type === "waste").reduce((s, e) => s + Math.abs(e.value), 0);

  const inp: React.CSSProperties = { background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "7px 11px", color: "#1a1a1a", fontSize: "clamp(11px,0.85vw,13px)", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "clamp(10px,1.5vw,22px) clamp(12px,2vw,28px)", gap: "clamp(8px,1vh,14px)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "clamp(15px,1.3vw,19px)", marginBottom: 2 }}>Inventory History</h1>
        <p style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>Full log of inventory movements, sales, and adjustments</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "clamp(8px,1vw,12px)", flexShrink: 0 }}>
        {[
          { label: "Total Events", value: String(EVENTS.length), color: "#1a1a1a" },
          { label: "Stock In",     value: `+$${totalIn.toFixed(2)}`,    color: "#16a34a" },
          { label: "Stock Out",    value: `-$${totalOut.toFixed(2)}`,   color: "#2563eb" },
          { label: "Waste Value",  value: `-$${wasteTotal.toFixed(2)}`, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px,1.2vw,14px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ color: "#9ca3af", fontSize: "clamp(9px,0.75vw,11px)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: "clamp(16px,1.5vw,20px)", fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events…" style={{ ...inp, width: "100%", paddingLeft: 30, boxSizing: "border-box" as const }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {(["all", "sale", "restock", "adjustment", "waste"] as const).map((t) => {
            const meta  = t === "all" ? { label: "All", color: "#374151", bg: "#f3f4f6" } : TYPE[t];
            const active = typeFilter === t;
            return (
              <button key={t} onClick={() => setType(t)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 7, border: "1px solid", borderColor: active ? meta.color : "rgba(0,0,0,0.1)", background: active ? meta.bg : "#fff", color: active ? meta.color : "#6b7280", cursor: "pointer", fontSize: "clamp(10px,0.78vw,12px)", fontWeight: 500, transition: "all 0.12s", whiteSpace: "nowrap" }}>
                <Filter size={11} />{meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, overflow: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(10px,0.85vw,13px)" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              {["Timestamp", "Type", "Item", "Change", "Value", "Note", "User"].map((h) => (
                <th key={h} style={{ padding: "9px 13px", textAlign: "left", color: "#6b7280", fontSize: "clamp(9px,0.75vw,11px)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No events match your search.</td></tr>
            ) : filtered.map((ev, i) => {
              const meta = TYPE[ev.type];
              const pos  = ev.qty > 0;
              return (
                <tr key={ev.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "9px 13px", color: "#9ca3af", whiteSpace: "nowrap" }}>{ev.timestamp}</td>
                  <td style={{ padding: "9px 13px" }}><span style={{ background: meta.bg, color: meta.color, borderRadius: 20, padding: "2px 9px", fontSize: "clamp(9px,0.72vw,11px)", fontWeight: 500, whiteSpace: "nowrap" }}>{meta.label}</span></td>
                  <td style={{ padding: "9px 13px", color: "#1a1a1a", whiteSpace: "nowrap" }}>{ev.item}</td>
                  <td style={{ padding: "9px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                      {pos ? <ArrowUpRight size={13} color="#16a34a" /> : <ArrowDownRight size={13} color="#dc2626" />}
                      <span style={{ color: pos ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{pos ? "+" : ""}{ev.qty} {ev.unit}</span>
                    </div>
                  </td>
                  <td style={{ padding: "9px 13px", color: pos ? "#16a34a" : "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {pos ? `+$${ev.value.toFixed(2)}` : `-$${Math.abs(ev.value).toFixed(2)}`}
                  </td>
                  <td style={{ padding: "9px 13px", color: "#6b7280" }}>{ev.note}</td>
                  <td style={{ padding: "9px 13px", color: "#374151", whiteSpace: "nowrap" }}>{ev.user}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
