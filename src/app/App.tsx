import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, ClipboardList,
  Settings2, History, Coffee, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { SellItems } from "./components/SellItems";
import { Restock } from "./components/Restock";
import { Products } from "./components/Products";
import { History as HistoryPage } from "./components/History";

type Tab = "dashboard" | "inventory" | "sell" | "restock" | "products" | "history";

const NAV: { id: Tab; label: string; Icon: any }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", Icon: Package },
  { id: "sell", label: "Sell Items", Icon: ShoppingCart },
  { id: "restock", label: "Restock", Icon: ClipboardList },
  { id: "products", label: "Products", Icon: Settings2 },
  { id: "history", label: "History", Icon: History },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [narrow, setNarrow] = useState(false);

  // Auto-collapse sidebar on narrow viewports
  useEffect(() => {
    const check = () => {
      const isNarrow = window.innerWidth < 900;
      setNarrow(isNarrow);
      if (isNarrow) setCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sidebarW = collapsed ? 56 : 200;

  const PAGES: Record<Tab, React.ReactNode> = {
    dashboard: <Dashboard />,
    inventory: <Inventory />,
    sell: <SellItems />,
    restock: <Restock />,
    products: <Products />,
    history: <HistoryPage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#f5f5f0", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW,
        flexShrink: 0,
        background: "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "14px 0" : "14px 14px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
        }}>
          <div style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            borderRadius: 8,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Coffee size={15} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <div style={{ color: "#1a1a1a", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Coffee Shop</div>
              <div style={{ color: "#9ca3af", fontSize: 10, whiteSpace: "nowrap" }}>Inventory Manager</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          {NAV.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                title={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "0 6px",
                  padding: collapsed ? "9px 0" : "9px 10px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 7,
                  border: "none",
                  background: active ? "#f0fdf4" : "transparent",
                  color: active ? "#16a34a" : "#6b7280",
                  cursor: "pointer",
                  transition: "background 0.12s, color 0.12s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; (e.currentTarget as HTMLElement).style.color = "#374151"; } }}
                onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; } }}
              >
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: "#16a34a", borderRadius: "0 2px 2px 0" }} />}
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle — hide on very narrow */}
        {!narrow && (
          <div style={{ padding: "8px 6px", borderTop: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-end",
                gap: 4, background: "transparent", border: "none",
                color: "#9ca3af", cursor: "pointer", padding: "6px 4px",
                borderRadius: 6, fontSize: 11, transition: "color 0.12s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#6b7280")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}
            >
              {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: 46,
          background: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {(() => {
              const cur = NAV.find((n) => n.id === activeTab);
              const Icon = cur?.Icon;
              return <>{Icon && <Icon size={14} color="#16a34a" />}<span style={{ color: "#1a1a1a", fontSize: 13, fontWeight: 600 }}>{cur?.label}</span></>;
            })()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#9ca3af", fontSize: 12 }}>Thu, Jun 12, 2026</span>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #22c55e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>M</div>
          </div>
        </div>

        {/* Page */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {PAGES[activeTab]}
        </div>
      </main>
    </div>
  );
}
