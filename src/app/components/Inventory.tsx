import { useState } from "react";
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";

type Item = {
  id: string; name: string; category: string; stock: number;
  minStock: number; unit: string; cost: number; lastUpdated: string;
};

const ITEMS: Item[] = [
  { id: "001", name: "Whole Milk", category: "Dairy", stock: 24, minStock: 10, unit: "gal", cost: 4.50, lastUpdated: "Jun 12, 9:14 AM" },
  { id: "002", name: "Oat Milk", category: "Dairy Alt", stock: 6, minStock: 8, unit: "L", cost: 3.20, lastUpdated: "Jun 12, 8:00 AM" },
  { id: "003", name: "Espresso Beans (House)", category: "Coffee", stock: 18, minStock: 5, unit: "kg", cost: 22.00, lastUpdated: "Jun 11, 6:30 PM" },
  { id: "004", name: "Drip Coffee Blend", category: "Coffee", stock: 4, minStock: 5, unit: "kg", cost: 18.00, lastUpdated: "Jun 11, 3:00 PM" },
  { id: "005", name: "Glazed Donut Mix", category: "Baking", stock: 12, minStock: 4, unit: "kg", cost: 6.50, lastUpdated: "Jun 12, 7:00 AM" },
  { id: "006", name: "All-Purpose Flour", category: "Baking", stock: 30, minStock: 10, unit: "kg", cost: 1.80, lastUpdated: "Jun 10, 2:00 PM" },
  { id: "007", name: "Granulated Sugar", category: "Baking", stock: 22, minStock: 8, unit: "kg", cost: 1.20, lastUpdated: "Jun 10, 2:00 PM" },
  { id: "008", name: "Butter (Unsalted)", category: "Dairy", stock: 3, minStock: 5, unit: "kg", cost: 8.00, lastUpdated: "Jun 12, 7:00 AM" },
  { id: "009", name: "Vanilla Extract", category: "Flavor", stock: 8, minStock: 2, unit: "btl", cost: 12.00, lastUpdated: "Jun 9, 10:00 AM" },
  { id: "010", name: "Caramel Sauce", category: "Flavor", stock: 14, minStock: 6, unit: "btl", cost: 9.50, lastUpdated: "Jun 11, 11:00 AM" },
  { id: "011", name: "Chocolate Syrup", category: "Flavor", stock: 0, minStock: 4, unit: "btl", cost: 8.75, lastUpdated: "Jun 12, 9:00 AM" },
  { id: "012", name: "12oz Paper Cups", category: "Supplies", stock: 450, minStock: 100, unit: "pcs", cost: 0.08, lastUpdated: "Jun 8, 9:00 AM" },
  { id: "013", name: "Cup Lids", category: "Supplies", stock: 380, minStock: 100, unit: "pcs", cost: 0.05, lastUpdated: "Jun 8, 9:00 AM" },
  { id: "014", name: "Napkins", category: "Supplies", stock: 600, minStock: 200, unit: "pcs", cost: 0.02, lastUpdated: "Jun 8, 9:00 AM" },
  { id: "015", name: "Matcha Powder", category: "Specialty", stock: 2, minStock: 3, unit: "kg", cost: 45.00, lastUpdated: "Jun 12, 8:30 AM" },
];

const statusOf = (item: Item) => item.stock === 0 ? "out" : item.stock < item.minStock ? "low" : "ok";

const STATUS: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  ok:  { label: "In Stock",     color: "#16a34a", bg: "#f0fdf4", Icon: CheckCircle },
  low: { label: "Low Stock",    color: "#d97706", bg: "#fffbeb", Icon: AlertTriangle },
  out: { label: "Out of Stock", color: "#dc2626", bg: "#fef2f2", Icon: XCircle },
};

export function Inventory() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [statusFilter, setStatus]   = useState("All");
  const [sort, setSort]             = useState<"name" | "stock" | "category">("name");

  const categories = ["All", ...Array.from(new Set(ITEMS.map((i) => i.category)))];

  const filtered = ITEMS
    .filter((i) => {
      const s = statusOf(i);
      return (
        (i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())) &&
        (category === "All" || i.category === category) &&
        (statusFilter === "All" || (statusFilter === "In Stock" && s === "ok") || (statusFilter === "Low Stock" && s === "low") || (statusFilter === "Out of Stock" && s === "out"))
      );
    })
    .sort((a, b) => sort === "stock" ? a.stock - b.stock : sort === "category" ? a.category.localeCompare(b.category) : a.name.localeCompare(b.name));

  const outCount = ITEMS.filter((i) => statusOf(i) === "out").length;
  const lowCount = ITEMS.filter((i) => statusOf(i) === "low").length;

  const inp: React.CSSProperties = { background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "7px 11px", color: "#1a1a1a", fontSize: "clamp(11px,0.85vw,13px)", outline: "none", cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "clamp(10px,1.5vw,22px) clamp(12px,2vw,28px)", gap: "clamp(8px,1vh,14px)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "clamp(15px,1.3vw,19px)", marginBottom: 2 }}>Inventory</h1>
        <p style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>{ITEMS.length} items • {lowCount} low • {outCount} out of stock</p>
      </div>

      {/* Alerts */}
      {(outCount > 0 || lowCount > 0) && (
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          {outCount > 0 && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, padding: "7px 13px", display: "flex", alignItems: "center", gap: 6 }}><XCircle size={13} color="#dc2626" /><span style={{ color: "#dc2626", fontSize: "clamp(10px,0.8vw,12px)" }}>{outCount} out of stock</span></div>}
          {lowCount > 0 && <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, padding: "7px 13px", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={13} color="#d97706" /><span style={{ color: "#d97706", fontSize: "clamp(10px,0.8vw,12px)" }}>{lowCount} running low</span></div>}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items…" style={{ ...inp, width: "100%", paddingLeft: 30, boxSizing: "border-box" as const }} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inp}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} style={inp}>
          {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setSort(sort === "name" ? "stock" : sort === "stock" ? "category" : "name")} style={{ ...inp, display: "flex", alignItems: "center", gap: 5, background: "#fff" }}>
          <ArrowUpDown size={12} /> Sort: {sort}
        </button>
      </div>

      {/* Table — fills remaining space, scrolls internally */}
      <div style={{ flex: 1, minHeight: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, overflow: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(10px,0.85vw,13px)" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              {["ID", "Item Name", "Category", "Stock", "Min", "Unit", "Cost", "Status", "Updated"].map((h) => (
                <th key={h} style={{ padding: "9px 13px", textAlign: "left", color: "#6b7280", fontSize: "clamp(10px,0.75vw,11px)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const { label, color, bg, Icon } = STATUS[statusOf(item)];
              return (
                <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "9px 13px", color: "#9ca3af", fontFamily: "monospace", fontSize: "clamp(9px,0.75vw,11px)" }}>{item.id}</td>
                  <td style={{ padding: "9px 13px", color: "#1a1a1a", fontWeight: 500, whiteSpace: "nowrap" }}>{item.name}</td>
                  <td style={{ padding: "9px 13px" }}><span style={{ background: "#f3f4f6", borderRadius: 4, padding: "2px 7px", color: "#6b7280", fontSize: "clamp(9px,0.75vw,11px)", whiteSpace: "nowrap" }}>{item.category}</span></td>
                  <td style={{ padding: "9px 13px", color: item.stock === 0 ? "#dc2626" : item.stock < item.minStock ? "#d97706" : "#1a1a1a", fontWeight: 600 }}>{item.stock}</td>
                  <td style={{ padding: "9px 13px", color: "#9ca3af" }}>{item.minStock}</td>
                  <td style={{ padding: "9px 13px", color: "#9ca3af" }}>{item.unit}</td>
                  <td style={{ padding: "9px 13px", color: "#374151" }}>${item.cost.toFixed(2)}</td>
                  <td style={{ padding: "9px 13px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: bg, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
                      <Icon size={11} color={color} /><span style={{ color, fontSize: "clamp(9px,0.75vw,11px)", fontWeight: 500 }}>{label}</span>
                    </div>
                  </td>
                  <td style={{ padding: "9px 13px", color: "#9ca3af", whiteSpace: "nowrap" }}>{item.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No items match your filters.</div>}
      </div>
    </div>
  );
}
