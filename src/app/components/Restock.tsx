import { useState } from "react";
import { Plus, Minus, ShoppingBasket, Send, CheckCircle, Truck } from "lucide-react";

type RestockItem = {
  id: string; name: string; category: string; currentStock: number;
  unit: string; supplier: string; unitCost: number; suggestedQty: number; orderQty: number;
};

const initItems: Omit<RestockItem, "orderQty">[] = [
  { id: "r1", name: "Oat Milk",          category: "Dairy Alt", currentStock: 6,   unit: "L",   supplier: "Green Farms Co.",   unitCost: 3.20,  suggestedQty: 24  },
  { id: "r2", name: "Drip Coffee Blend", category: "Coffee",    currentStock: 4,   unit: "kg",  supplier: "Mountain Roasters", unitCost: 18.00, suggestedQty: 10  },
  { id: "r3", name: "Butter (Unsalted)", category: "Dairy",     currentStock: 3,   unit: "kg",  supplier: "Green Farms Co.",   unitCost: 8.00,  suggestedQty: 10  },
  { id: "r4", name: "Chocolate Syrup",   category: "Flavor",    currentStock: 0,   unit: "btl", supplier: "Sweet Depot",       unitCost: 8.75,  suggestedQty: 12  },
  { id: "r5", name: "Matcha Powder",     category: "Specialty", currentStock: 2,   unit: "kg",  supplier: "Kyoto Imports",     unitCost: 45.00, suggestedQty: 5   },
  { id: "r6", name: "12oz Paper Cups",   category: "Supplies",  currentStock: 450, unit: "pcs", supplier: "PackRight",         unitCost: 0.08,  suggestedQty: 500 },
  { id: "r7", name: "Whole Milk",        category: "Dairy",     currentStock: 24,  unit: "gal", supplier: "Green Farms Co.",   unitCost: 4.50,  suggestedQty: 20  },
  { id: "r8", name: "Vanilla Extract",   category: "Flavor",    currentStock: 8,   unit: "btl", supplier: "Sweet Depot",       unitCost: 12.00, suggestedQty: 6   },
];

const suppliers = Array.from(new Set(initItems.map((i) => i.supplier)));

const pendingOrders = [
  { id: "ORD-2841", date: "Jun 10, 2026", supplier: "Mountain Roasters", items: 3, total: 156.00, status: "In Transit", eta: "Jun 14" },
  { id: "ORD-2840", date: "Jun 8, 2026",  supplier: "Green Farms Co.",   items: 5, total: 248.50, status: "Processing", eta: "Jun 15" },
];

export function Restock() {
  const [items, setItems]     = useState<RestockItem[]>(initItems.map((i) => ({ ...i, orderQty: i.suggestedQty })));
  const [selected, setSelected] = useState<Set<string>>(new Set(initItems.filter((i) => i.currentStock < 5).map((i) => i.id)));
  const [submitted, setSub]   = useState(false);
  const [supFilter, setSupFilter] = useState("All");

  const toggle  = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const adjQty  = (id: string, d: number) => setItems((p) => p.map((i) => i.id === id ? { ...i, orderQty: Math.max(1, i.orderQty + d) } : i));

  const filtered      = supFilter === "All" ? items : items.filter((i) => i.supplier === supFilter);
  const selectedItems = items.filter((i) => selected.has(i.id));
  const orderTotal    = selectedItems.reduce((s, i) => s + i.orderQty * i.unitCost, 0);

  const submitOrder = () => { setSub(true); setTimeout(() => setSub(false), 3000); setSelected(new Set()); };

  const qBtn: React.CSSProperties = { background: "#f3f4f6", border: "none", borderRadius: 4, width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  const sel: React.CSSProperties  = { background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "6px 10px", color: "#374151", fontSize: "clamp(10px,0.8vw,12px)", cursor: "pointer", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "clamp(10px,1.5vw,22px) clamp(12px,2vw,28px)", gap: "clamp(8px,1vh,14px)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "clamp(15px,1.3vw,19px)", marginBottom: 2 }}>Restock Orders</h1>
        <p style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>Review stock levels and place restock orders</p>
      </div>

      {/* Active orders */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(8px,1vw,12px)", flexShrink: 0 }}>
        {pendingOrders.map((o) => (
          <div key={o.id} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px,1.2vw,16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ color: "#1a1a1a", fontSize: "clamp(11px,0.9vw,13px)", fontWeight: 600 }}>{o.id}</div>
                <div style={{ color: "#9ca3af", fontSize: "clamp(10px,0.75vw,11px)" }}>{o.date} • {o.supplier}</div>
              </div>
              <span style={{ background: o.status === "In Transit" ? "#eff6ff" : "#fffbeb", color: o.status === "In Transit" ? "#2563eb" : "#d97706", borderRadius: 20, padding: "2px 9px", fontSize: "clamp(10px,0.75vw,11px)", fontWeight: 500, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
                {o.status === "In Transit" && <Truck size={10} />}{o.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[["Items", String(o.items), "#374151"], ["Total", `$${o.total.toFixed(2)}`, "#16a34a"], ["ETA", o.eta, "#0ea5e9"]].map(([l, v, c]) => (
                <div key={l}><div style={{ color: "#9ca3af", fontSize: "clamp(9px,0.7vw,10px)" }}>{l}</div><div style={{ color: c, fontSize: "clamp(11px,0.9vw,13px)", fontWeight: 600 }}>{v}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: "clamp(12px,1.5vw,20px)" }}>
        {/* Table */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0 }}>
            <h3 style={{ color: "#374151", fontSize: "clamp(12px,1vw,14px)" }}>Order Items</h3>
            <select value={supFilter} onChange={(e) => setSupFilter(e.target.value)} style={sel}>
              <option>All</option>
              {suppliers.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minHeight: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, overflow: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(10px,0.85vw,13px)" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  {["", "Item", "Supplier", "Current", "Order Qty", "Unit Cost", "Line Total"].map((h) => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: "#6b7280", fontSize: "clamp(9px,0.75vw,11px)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const isSel = selected.has(item.id);
                  return (
                    <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", background: isSel ? "#f0fdf4" : "transparent" }}>
                      <td style={{ padding: "9px 12px" }}><input type="checkbox" checked={isSel} onChange={() => toggle(item.id)} style={{ accentColor: "#16a34a", cursor: "pointer", width: 14, height: 14 }} /></td>
                      <td style={{ padding: "9px 12px" }}>
                        <div style={{ color: "#1a1a1a", fontWeight: 500, whiteSpace: "nowrap" }}>{item.name}</div>
                        <div style={{ color: "#9ca3af", fontSize: "clamp(9px,0.7vw,10px)" }}>{item.category}</div>
                      </td>
                      <td style={{ padding: "9px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>{item.supplier}</td>
                      <td style={{ padding: "9px 12px", color: item.currentStock === 0 ? "#dc2626" : item.currentStock < 5 ? "#d97706" : "#374151", fontWeight: 600, whiteSpace: "nowrap" }}>{item.currentStock} {item.unit}</td>
                      <td style={{ padding: "9px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => adjQty(item.id, -1)} style={qBtn}><Minus size={10} color="#374151" /></button>
                          <span style={{ color: "#1a1a1a", fontWeight: 600, width: 26, textAlign: "center" }}>{item.orderQty}</span>
                          <button onClick={() => adjQty(item.id, 1)} style={qBtn}><Plus size={10} color="#374151" /></button>
                        </div>
                      </td>
                      <td style={{ padding: "9px 12px", color: "#6b7280" }}>${item.unitCost.toFixed(2)}</td>
                      <td style={{ padding: "9px 12px", color: isSel ? "#16a34a" : "#9ca3af", fontWeight: isSel ? 600 : 400 }}>
                        {isSel ? `$${(item.orderQty * item.unitCost).toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary panel */}
        <div style={{ width: "clamp(200px,18vw,250px)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 style={{ color: "#374151", fontSize: "clamp(12px,1vw,14px)", flexShrink: 0 }}>Order Summary</h3>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(12px,1.3vw,16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <ShoppingBasket size={14} color="#16a34a" />
              <span style={{ color: "#374151", fontSize: "clamp(11px,0.9vw,13px)" }}>{selectedItems.length} items selected</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {selectedItems.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#6b7280", fontSize: "clamp(10px,0.78vw,11px)" }}>{i.name} ×{i.orderQty}</span>
                  <span style={{ color: "#374151", fontSize: "clamp(10px,0.78vw,11px)" }}>${(i.orderQty * i.unitCost).toFixed(2)}</span>
                </div>
              ))}
            </div>
            {selectedItems.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 10, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#1a1a1a", fontWeight: 600, fontSize: "clamp(12px,1vw,14px)" }}>Total</span>
                  <span style={{ color: "#16a34a", fontSize: "clamp(14px,1.2vw,16px)", fontWeight: 700 }}>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
            {submitted ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px", color: "#16a34a", fontSize: "clamp(11px,0.9vw,13px)", fontWeight: 600 }}>
                <CheckCircle size={14} /> Order Sent!
              </div>
            ) : (
              <button onClick={submitOrder} disabled={selectedItems.length === 0} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: selectedItems.length === 0 ? "#f3f4f6" : "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", borderRadius: 8, padding: "11px 0", color: selectedItems.length === 0 ? "#9ca3af" : "#fff", fontSize: "clamp(12px,1vw,13px)", fontWeight: 600, cursor: selectedItems.length === 0 ? "default" : "pointer" }}>
                <Send size={13} /> Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
