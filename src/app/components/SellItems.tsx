import { useState } from "react";
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, CheckCircle } from "lucide-react";

type Product = { id: string; name: string; price: number; category: string; emoji: string };

const PRODUCTS: Product[] = [
  { id: "p1",  name: "Espresso",        price: 3.50, category: "Coffee",   emoji: "☕" },
  { id: "p2",  name: "Cappuccino",      price: 5.25, category: "Coffee",   emoji: "☕" },
  { id: "p3",  name: "Caramel Latte",   price: 7.00, category: "Coffee",   emoji: "☕" },
  { id: "p4",  name: "Cold Brew",       price: 7.00, category: "Coffee",   emoji: "🧊" },
  { id: "p5",  name: "Matcha Latte",    price: 8.00, category: "Specialty",emoji: "🍵" },
  { id: "p6",  name: "Hot Chocolate",   price: 5.50, category: "Specialty",emoji: "🍫" },
  { id: "p7",  name: "Glazed Donut",    price: 2.50, category: "Donuts",   emoji: "🍩" },
  { id: "p8",  name: "Chocolate Donut", price: 3.00, category: "Donuts",   emoji: "🍩" },
  { id: "p9",  name: "Maple Glazed",    price: 3.25, category: "Donuts",   emoji: "🍩" },
  { id: "p10", name: "Sprinkle Donut",  price: 2.75, category: "Donuts",   emoji: "🍩" },
  { id: "p11", name: "Croissant",       price: 4.50, category: "Pastry",   emoji: "🥐" },
  { id: "p12", name: "Blueberry Muffin",price: 3.75, category: "Pastry",   emoji: "🧁" },
  { id: "p13", name: "Banana Bread",    price: 4.00, category: "Pastry",   emoji: "🍞" },
  { id: "p14", name: "Donut 6-Pack",    price: 14.00,category: "Bundles",  emoji: "📦" },
  { id: "p15", name: "Coffee + Donut",  price: 8.50, category: "Bundles",  emoji: "📦" },
];

type CartItem = Product & { qty: number };

export function SellItems() {
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [catFilter, setCatFilter] = useState("All");
  const [success, setSuccess]     = useState(false);
  const [payMethod, setPay]       = useState<"card" | "cash">("card");

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const filtered = catFilter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === catFilter);

  const addToCart = (product: Product) =>
    setCart((prev) => {
      const ex = prev.find((c) => c.id === product.id);
      return ex ? prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...product, qty: 1 }];
    });

  const updateQty = (id: string, delta: number) =>
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax      = subtotal * 0.08;
  const total    = subtotal + tax;

  const checkout = () => { setCart([]); setSuccess(true); setTimeout(() => setSuccess(false), 3000); };

  const qtyBtn: React.CSSProperties = { background: "#f3f4f6", border: "none", borderRadius: 5, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Products */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "clamp(10px,1.5vw,22px) clamp(12px,2vw,24px)", borderRight: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", gap: "clamp(8px,1vh,14px)" }}>
        <div style={{ flexShrink: 0 }}>
          <h1 style={{ color: "#1a1a1a", fontSize: "clamp(15px,1.3vw,19px)", marginBottom: 2 }}>Sell Items</h1>
          <p style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>Tap a product to add it to the current sale</p>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "5px 13px", borderRadius: 20, border: "1px solid", borderColor: catFilter === c ? "#16a34a" : "rgba(0,0,0,0.1)", background: catFilter === c ? "#f0fdf4" : "#fff", color: catFilter === c ? "#16a34a" : "#6b7280", cursor: "pointer", fontSize: "clamp(10px,0.8vw,12px)", fontWeight: 500, transition: "all 0.12s" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Product grid — fills remaining space */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(110px,10vw,155px), 1fr))", gap: "clamp(8px,1vw,12px)", alignContent: "start" }}>
          {filtered.map((p) => (
            <button key={p.id} onClick={() => addToCart(p)} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "clamp(12px,1.2vw,18px) clamp(10px,1vw,14px)", cursor: "pointer", textAlign: "left", transition: "border-color 0.12s, box-shadow 0.12s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#16a34a"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(22,163,74,0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
              <div style={{ fontSize: "clamp(20px,2vw,28px)", marginBottom: 6 }}>{p.emoji}</div>
              <div style={{ color: "#374151", fontSize: "clamp(10px,0.85vw,13px)", fontWeight: 500, marginBottom: 3 }}>{p.name}</div>
              <div style={{ color: "#16a34a", fontSize: "clamp(12px,1vw,15px)", fontWeight: 700 }}>${p.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart — fixed width that shrinks on narrow screens */}
      <div style={{ width: "clamp(240px,22vw,310px)", flexShrink: 0, display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        {/* Header */}
        <div style={{ padding: "clamp(12px,1.2vw,20px) clamp(12px,1.5vw,18px) clamp(10px,1vw,14px)", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fff", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <ShoppingCart size={15} color="#16a34a" />
            <span style={{ color: "#1a1a1a", fontSize: "clamp(13px,1.1vw,15px)", fontWeight: 600 }}>Current Sale</span>
            {cart.length > 0 && (
              <span style={{ background: "#16a34a", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 600, marginLeft: "auto" }}>
                {cart.reduce((s, c) => s + c.qty, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(8px,1vw,12px) clamp(10px,1.2vw,14px)" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: "clamp(11px,0.85vw,13px)" }}>
              No items yet.<br />Tap a product to add.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cart.map((item) => (
                <div key={item.id} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 9, padding: "10px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                    <div>
                      <div style={{ color: "#374151", fontSize: "clamp(10px,0.85vw,13px)", fontWeight: 500 }}>{item.emoji} {item.name}</div>
                      <div style={{ color: "#9ca3af", fontSize: "clamp(9px,0.75vw,11px)" }}>${item.price.toFixed(2)} each</div>
                    </div>
                    <button onClick={() => setCart((p) => p.filter((c) => c.id !== item.id))} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}>
                      <Trash2 size={12} color="#9ca3af" />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={qtyBtn}><Minus size={11} color="#374151" /></button>
                      <span style={{ color: "#1a1a1a", fontSize: 13, fontWeight: 600, width: 18, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={qtyBtn}><Plus size={11} color="#374151" /></button>
                    </div>
                    <span style={{ color: "#16a34a", fontSize: "clamp(12px,1vw,14px)", fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout */}
        <div style={{ padding: "clamp(10px,1.2vw,16px) clamp(12px,1.5vw,18px)", borderTop: "1px solid rgba(0,0,0,0.07)", background: "#fff", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>Subtotal</span>
              <span style={{ color: "#374151", fontSize: "clamp(10px,0.8vw,12px)" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9ca3af", fontSize: "clamp(10px,0.8vw,12px)" }}>Tax (8%)</span>
              <span style={{ color: "#374151", fontSize: "clamp(10px,0.8vw,12px)" }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
              <span style={{ color: "#1a1a1a", fontSize: "clamp(12px,1vw,14px)", fontWeight: 600 }}>Total</span>
              <span style={{ color: "#16a34a", fontSize: "clamp(14px,1.3vw,17px)", fontWeight: 700 }}>${total.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {(["card", "cash"] as const).map((m) => (
              <button key={m} onClick={() => setPay(m)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px 0", borderRadius: 7, border: "1px solid", borderColor: payMethod === m ? "#16a34a" : "rgba(0,0,0,0.1)", background: payMethod === m ? "#f0fdf4" : "#fff", color: payMethod === m ? "#16a34a" : "#9ca3af", cursor: "pointer", fontSize: "clamp(10px,0.8vw,12px)", fontWeight: 500 }}>
                {m === "card" ? <CreditCard size={13} /> : <Banknote size={13} />}{m === "card" ? "Card" : "Cash"}
              </button>
            ))}
          </div>
          {success ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px", color: "#16a34a", fontSize: "clamp(11px,0.9vw,13px)", fontWeight: 600 }}>
              <CheckCircle size={14} /> Sale Complete!
            </div>
          ) : (
            <button onClick={checkout} disabled={cart.length === 0} style={{ width: "100%", background: cart.length === 0 ? "#f3f4f6" : "linear-gradient(135deg, #16a34a, #22c55e)", border: "none", borderRadius: 8, padding: "11px 0", color: cart.length === 0 ? "#9ca3af" : "#fff", fontSize: "clamp(12px,1vw,14px)", fontWeight: 600, cursor: cart.length === 0 ? "default" : "pointer" }}>
              Charge ${total.toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
