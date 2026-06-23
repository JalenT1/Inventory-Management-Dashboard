import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package, Users } from "lucide-react";

const weeklyData = [
  { label: "Mon", revenue: 1240, orders: 42 },
  { label: "Tue", revenue: 1580, orders: 55 },
  { label: "Wed", revenue: 1320, orders: 48 },
  { label: "Thu", revenue: 1750, orders: 63 },
  { label: "Fri", revenue: 2100, orders: 78 },
  { label: "Sat", revenue: 2450, orders: 91 },
  { label: "Sun", revenue: 1890, orders: 67 },
];

const monthlyData = [
  { label: "W1", revenue: 8240 },
  { label: "W2", revenue: 9580 },
  { label: "W3", revenue: 7320 },
  { label: "W4", revenue: 11500 },
];

const yearlyData = [
  { label: "Jan", revenue: 32400 }, { label: "Feb", revenue: 28900 },
  { label: "Mar", revenue: 35600 }, { label: "Apr", revenue: 41200 },
  { label: "May", revenue: 38700 }, { label: "Jun", revenue: 44100 },
  { label: "Jul", revenue: 47800 }, { label: "Aug", revenue: 45200 },
  { label: "Sep", revenue: 39400 }, { label: "Oct", revenue: 43600 },
  { label: "Nov", revenue: 51200 }, { label: "Dec", revenue: 58900 },
];

const ytdData = yearlyData.slice(0, 6);

type Period = "weekly" | "monthly" | "yearly" | "ytd";
const periodMap: Record<Period, any[]> = { weekly: weeklyData, monthly: monthlyData, yearly: yearlyData, ytd: ytdData };
const periodTotals: Record<Period, number> = {
  weekly: weeklyData.reduce((s, d) => s + d.revenue, 0),
  monthly: monthlyData.reduce((s, d) => s + d.revenue, 0),
  yearly: yearlyData.reduce((s, d) => s + d.revenue, 0),
  ytd: ytdData.reduce((s, d) => s + d.revenue, 0),
};

const TooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "8px 12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <p style={{ color: "#9ca3af", fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "#16a34a", fontSize: 14, fontWeight: 600 }}>${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

const topItems = [
  { name: "Caramel Latte", sold: 48, revenue: 336, pct: 82 },
  { name: "Glazed Donut (6pk)", sold: 34, revenue: 204, pct: 65 },
  { name: "Cold Brew", sold: 29, revenue: 203, pct: 56 },
  { name: "Chocolate Croissant", sold: 26, revenue: 130, pct: 50 },
  { name: "Matcha Latte", sold: 22, revenue: 176, pct: 42 },
];

export function Dashboard() {
  const [period, setPeriod] = useState<Period>("weekly");
  const data = periodMap[period];
  const total = periodTotals[period];

  const statCards = [
    { label: "Today's Revenue", value: "$2,450", change: "+12.4%", up: true, icon: DollarSign, sub: "vs $2,180 yesterday" },
    { label: "Orders Today", value: "91", change: "+8.3%", up: true, icon: ShoppingBag, sub: "84 yesterday" },
    { label: "Items Sold", value: "247", change: "+5.1%", up: true, icon: Package, sub: "235 yesterday" },
    { label: "Avg Order Value", value: "$26.92", change: "-1.8%", up: false, icon: Users, sub: "vs $27.41" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "clamp(12px, 1.5vw, 24px) clamp(12px, 2vw, 28px)", gap: "clamp(10px, 1.2vh, 18px)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ color: "#1a1a1a", fontSize: "clamp(16px, 1.4vw, 20px)", marginBottom: 2 }}>Manager Dashboard</h1>
        <p style={{ color: "#9ca3af", fontSize: "clamp(11px,0.9vw,13px)" }}>Thursday, June 12, 2026 — Coffee Shop</p>
      </div>

      {/* Stat cards — auto-fit so they reflow on narrow screens */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "clamp(8px, 1vw, 14px)", flexShrink: 0 }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px, 1.2vw, 16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: "#9ca3af", fontSize: "clamp(10px, 0.8vw, 12px)" }}>{card.label}</span>
                <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "5px 6px", flexShrink: 0 }}>
                  <Icon size={13} color="#16a34a" />
                </div>
              </div>
              <div style={{ color: "#1a1a1a", fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 700, marginBottom: 5 }}>{card.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                {card.up ? <TrendingUp size={12} color="#16a34a" /> : <TrendingDown size={12} color="#ef4444" />}
                <span style={{ color: card.up ? "#16a34a" : "#ef4444", fontSize: "clamp(10px, 0.8vw, 12px)", fontWeight: 500 }}>{card.change}</span>
                <span style={{ color: "#9ca3af", fontSize: "clamp(10px, 0.75vw, 11px)" }}>{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue chart — flex: 1 to fill remaining height */}
      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px, 1.2vw, 16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", flex: 2, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ color: "#1a1a1a", fontSize: "clamp(13px, 1.1vw, 15px)", marginBottom: 1 }}>Revenue Flow</h2>
            <p style={{ color: "#16a34a", fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 700 }}>
              ${total.toLocaleString()}
              <span style={{ color: "#9ca3af", fontSize: "clamp(10px, 0.8vw, 12px)", fontWeight: 400, marginLeft: 8 }}>
                {period === "weekly" ? "this week" : period === "monthly" ? "this month" : period === "yearly" ? "this year" : "year to date"}
              </span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {(["weekly", "monthly", "yearly", "ytd"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid", borderColor: period === p ? "#16a34a" : "rgba(0,0,0,0.1)", background: period === p ? "#f0fdf4" : "transparent", color: period === p ? "#16a34a" : "#9ca3af", cursor: "pointer", fontSize: "clamp(10px, 0.75vw, 12px)", fontWeight: 500, transition: "all 0.12s" }}>
                {p === "weekly" ? "7D" : p === "monthly" ? "30D" : p === "yearly" ? "1Y" : "YTD"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={52} />
              <Tooltip content={<TooltipContent />} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1vw, 14px)", flex: 1, minHeight: 0 }}>
        {/* Top sellers */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px, 1.2vw, 16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          <h3 style={{ color: "#1a1a1a", fontSize: "clamp(12px, 1vw, 14px)", marginBottom: "clamp(8px, 1vh, 14px)", flexShrink: 0 }}>Top Sellers Today</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 0.8vh, 12px)", flex: 1, justifyContent: "space-between" }}>
            {topItems.map((item) => (
              <div key={item.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#374151", fontSize: "clamp(10px, 0.8vw, 12px)" }}>{item.name}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: "#9ca3af", fontSize: "clamp(10px, 0.75vw, 11px)" }}>{item.sold} sold</span>
                    <span style={{ color: "#16a34a", fontSize: "clamp(10px, 0.8vw, 12px)", fontWeight: 600 }}>${item.revenue}</span>
                  </div>
                </div>
                <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${item.pct}%`, background: "linear-gradient(90deg, #16a34a, #22c55e)", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders chart */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "clamp(10px, 1.2vw, 16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <h3 style={{ color: "#1a1a1a", fontSize: "clamp(12px, 1vw, 14px)", marginBottom: "clamp(6px, 0.8vh, 12px)", flexShrink: 0 }}>Orders This Week</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }} labelStyle={{ color: "#9ca3af" }} itemStyle={{ color: "#0ea5e9" }} />
                <Bar dataKey="orders" fill="#0ea5e9" radius={[3, 3, 0, 0]} fillOpacity={0.82} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
