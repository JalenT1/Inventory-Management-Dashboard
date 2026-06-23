import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, CheckCircle } from "lucide-react";

type Product = { id: string; name: string; category: string; price: number; cost: number; active: boolean; emoji: string; description: string };

const initProducts: Product[] = [
  { id: "p1",  name: "Espresso",          category: "Coffee",   price: 3.50,  cost: 0.85, active: true,  emoji: "☕", description: "Single origin espresso shot" },
  { id: "p2",  name: "Cappuccino",        category: "Coffee",   price: 5.25,  cost: 1.20, active: true,  emoji: "☕", description: "Espresso with steamed and foamed milk" },
  { id: "p3",  name: "Caramel Latte",     category: "Coffee",   price: 7.00,  cost: 1.80, active: true,  emoji: "☕", description: "Espresso, milk, house caramel sauce" },
  { id: "p4",  name: "Cold Brew",         category: "Coffee",   price: 7.00,  cost: 1.50, active: true,  emoji: "🧊", description: "12-hour steeped cold brew" },
  { id: "p5",  name: "Matcha Latte",      category: "Specialty",price: 8.00,  cost: 2.10, active: true,  emoji: "🍵", description: "Ceremonial grade matcha with oat milk" },
  { id: "p6",  name: "Hot Chocolate",     category: "Specialty",price: 5.50,  cost: 1.30, active: true,  emoji: "🍫", description: "Rich dark chocolate blend" },
  { id: "p7",  name: "Glazed Donut",      category: "Donuts",   price: 2.50,  cost: 0.60, active: true,  emoji: "🍩", description: "Classic glazed yeast donut" },
  { id: "p8",  name: "Chocolate Donut",   category: "Donuts",   price: 3.00,  cost: 0.70, active: true,  emoji: "🍩", description: "Chocolate frosted with sprinkles" },
  { id: "p9",  name: "Maple Glazed",      category: "Donuts",   price: 3.25,  cost: 0.75, active: true,  emoji: "🍩", description: "Vermont maple glaze" },
  { id: "p10", name: "Croissant",         category: "Pastry",   price: 4.50,  cost: 1.10, active: true,  emoji: "🥐", description: "Butter croissant, baked fresh daily" },
  { id: "p11", name: "Blueberry Muffin",  category: "Pastry",   price: 3.75,  cost: 0.90, active: true,  emoji: "🧁", description: "Wild blueberry jumbo muffin" },
  { id: "p12", name: "Donut 6-Pack",      category: "Bundles",  price: 14.00, cost: 3.50, active: true,  emoji: "📦", description: "Choice of 6 donuts" },
  { id: "p13", name: "Pumpkin Spice Latte",category:"Seasonal", price: 7.50,  cost: 1.90, active: false, emoji: "🎃", description: "Fall seasonal special" },
];

const CATEGORIES = ["Coffee", "Specialty", "Donuts", "Pastry", "Bundles", "Seasonal"];
const BLANK: Omit<Product, "id"> = { name: "", category: "Coffee", price: 0, cost: 0, active: true, emoji: "☕", description: "" };

export function Products() {
  const [products, setProducts] = useState(initProducts);
  const [editing, setEditing]   = useState<string | null>(null);
  const [adding, setAdding]     = useState(false);
  const [draft, setDraft]       = useState<Omit<Product, "id">>(BLANK);
  const [catFilter, setCat]     = useState("All");
  const [toast, setToast]       = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered   = catFilter === "All" ? products : products.filter((p) => p.category === catFilter);
  const categories = ["All", ...CATEGORIES];

  const startEdit = (p: Product) => { setEditing(p.id); setDraft({ name: p.name, category: p.category, price: p.price, cost: p.cost, active: p.active, emoji: p.emoji, description: p.description }); setAdding(false); };
  const saveEdit  = () => { if (!draft.name.trim()) return; setProducts((prev) => prev.map((p) => p.id === editing ? { ...p, ...draft } : p)); setEditing(null); showToast("Product updated."); };
  const deleteProd = (id: string) => { setProducts((prev) => prev.filter((p) => p.id !== id)); showToast("Product removed."); };
  const toggleActive = (id: string) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const addProduct   = () => { if (!draft.name.trim()) return; setProducts((prev) => [...prev, { id: `p${Date.now()}`, ...draft }]); setAdding(false); setDraft(BLANK); showToast("Product added."); };
  const margin = (p: Product) => p.price > 0 ? (((p.price - p.cost) / p.price) * 100).toFixed(0) : "0";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "clamp(10px,1.5vw,22px) clamp(12px,2vw,28px)", gap: "clamp(8px,1vh,12px)", overflow: "hidden", position: "relative" }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 24, background: "#fff", border: "1px solid #bbf7d0", borderRadius: 9, padding: "10px 14px", display: "flex", alignItems: "center", gap: 7, zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          <CheckCircle size={14} color="#16a34a" /><span style={{ color: "#16a34a", fontSize: 13 }}>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ color: "#1a1a1a", fontSize: "clamp(15px,1.3vw,19px)", marginBottom: 2 }}>Products</h1>
          <p style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>{products.length} products • {products.filter((p) => p.active).length} active</p>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); setDraft(BLANK); }} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: "clamp(11px,0.9vw,13px)", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.22)", flexShrink: 0 }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "clamp(12px,1.3vw,18px)", flexShrink: 0, boxShadow: "0 2px 8px rgba(22,163,74,0.08)" }}>
          <h3 style={{ color: "#1a1a1a", fontSize: "clamp(12px,1vw,14px)", marginBottom: 12 }}>New Product</h3>
          <ProdForm draft={draft} setDraft={setDraft} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={addProduct} style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", borderRadius: 7, padding: "7px 14px", color: "#fff", fontSize: "clamp(11px,0.85vw,12px)", fontWeight: 600, cursor: "pointer" }}><Save size={13} /> Save</button>
            <button onClick={() => setAdding(false)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "7px 12px", color: "#374151", fontSize: "clamp(11px,0.85vw,12px)", cursor: "pointer" }}><X size={13} /> Cancel</button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "5px 13px", borderRadius: 20, border: "1px solid", borderColor: catFilter === c ? "#16a34a" : "rgba(0,0,0,0.1)", background: catFilter === c ? "#f0fdf4" : "#fff", color: catFilter === c ? "#16a34a" : "#6b7280", cursor: "pointer", fontSize: "clamp(10px,0.8vw,12px)", fontWeight: 500, transition: "all 0.12s" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ flex: 1, minHeight: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, overflow: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "clamp(10px,0.85vw,13px)" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              {["Product", "Category", "Price", "Cost", "Margin", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "9px 13px", textAlign: "left", color: "#6b7280", fontSize: "clamp(9px,0.75vw,11px)", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              editing === p.id ? (
                <tr key={p.id} style={{ background: "#f0fdf4", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td colSpan={7} style={{ padding: "14px" }}>
                    <ProdForm draft={draft} setDraft={setDraft} />
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={saveEdit} style={{ display: "flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", borderRadius: 7, padding: "7px 14px", color: "#fff", fontSize: "clamp(10px,0.85vw,12px)", fontWeight: 600, cursor: "pointer" }}><Save size={12} /> Save</button>
                      <button onClick={() => setEditing(null)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 7, padding: "7px 12px", color: "#374151", fontSize: "clamp(10px,0.85vw,12px)", cursor: "pointer" }}><X size={12} /> Cancel</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", opacity: p.active ? 1 : 0.55 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "10px 13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "clamp(16px,1.4vw,20px)" }}>{p.emoji}</span>
                      <div>
                        <div style={{ color: "#1a1a1a", fontWeight: 500, whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ color: "#9ca3af", fontSize: "clamp(9px,0.72vw,10px)" }}>{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 13px" }}><span style={{ background: "#f3f4f6", borderRadius: 4, padding: "2px 7px", color: "#6b7280", fontSize: "clamp(9px,0.72vw,10px)", whiteSpace: "nowrap" }}>{p.category}</span></td>
                  <td style={{ padding: "10px 13px", color: "#16a34a", fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: "10px 13px", color: "#9ca3af" }}>${p.cost.toFixed(2)}</td>
                  <td style={{ padding: "10px 13px" }}><span style={{ color: Number(margin(p)) > 60 ? "#16a34a" : Number(margin(p)) > 40 ? "#d97706" : "#dc2626", fontWeight: 600 }}>{margin(p)}%</span></td>
                  <td style={{ padding: "10px 13px" }}>
                    <button onClick={() => toggleActive(p.id)} style={{ background: p.active ? "#f0fdf4" : "#f3f4f6", border: "none", borderRadius: 20, padding: "2px 9px", color: p.active ? "#16a34a" : "#9ca3af", fontSize: "clamp(9px,0.75vw,11px)", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {p.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={{ padding: "10px 13px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => startEdit(p)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}><Pencil size={12} color="#374151" /></button>
                      <button onClick={() => deleteProd(p.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}><Trash2 size={12} color="#dc2626" /></button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProdForm({ draft, setDraft }: { draft: Omit<Product, "id">; setDraft: (d: Omit<Product, "id">) => void }) {
  const f = (key: keyof Omit<Product, "id">, val: any) => setDraft({ ...draft, [key]: val });
  const inp2: React.CSSProperties = { width: "100%", background: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 7, padding: "7px 10px", color: "#1a1a1a", fontSize: "clamp(11px,0.85vw,13px)", outline: "none", boxSizing: "border-box" as const };
  const lbl: React.CSSProperties  = { color: "#6b7280", fontSize: "clamp(9px,0.75vw,11px)", display: "block", marginBottom: 4 };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 60px", gap: 10 }}>
      <div><label style={lbl}>Name *</label><input value={draft.name} onChange={(e) => f("name", e.target.value)} placeholder="Product name" style={inp2} /></div>
      <div><label style={lbl}>Category</label><select value={draft.category} onChange={(e) => f("category", e.target.value)} style={{ ...inp2, cursor: "pointer" }}>{["Coffee","Specialty","Donuts","Pastry","Bundles","Seasonal"].map((c) => <option key={c}>{c}</option>)}</select></div>
      <div><label style={lbl}>Price ($)</label><input type="number" value={draft.price} onChange={(e) => f("price", parseFloat(e.target.value) || 0)} style={inp2} /></div>
      <div><label style={lbl}>Cost ($)</label><input type="number" value={draft.cost} onChange={(e) => f("cost", parseFloat(e.target.value) || 0)} style={inp2} /></div>
      <div><label style={lbl}>Emoji</label><input value={draft.emoji} onChange={(e) => f("emoji", e.target.value)} style={inp2} /></div>
      <div style={{ gridColumn: "1 / -1" }}><label style={lbl}>Description</label><input value={draft.description} onChange={(e) => f("description", e.target.value)} placeholder="Short description" style={inp2} /></div>
    </div>
  );
}

