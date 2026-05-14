import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import QueueList from "./QueueList"

export default async function Queue() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F5", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      <div style={{ width: "220px", background: "#1A1A2E", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "16px" }}>P</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>PostFlow</span>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: "8px" }}>Main Menu</div>
          {[
            { name: "Dashboard", href: "/dashboard", icon: "⊞" },
            { name: "Queue", href: "/dashboard/queue", icon: "≡" },
            { name: "Calendar", href: "/dashboard/calendar", icon: "▦" },
            { name: "Pages", href: "/dashboard/pages", icon: "f" },
          ].map((item) => (
            <a key={item.name} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              textDecoration: "none", padding: "9px 10px", borderRadius: "8px",
              color: item.name === "Queue" ? "white" : "rgba(255,255,255,0.45)",
              background: item.name === "Queue" ? "rgba(255,107,53,0.2)" : "transparent",
              borderLeft: item.name === "Queue" ? "3px solid #FF6B35" : "3px solid transparent",
              marginBottom: "2px", fontSize: "13px", fontWeight: item.name === "Queue" ? "600" : "400",
            }}>
              <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", marginBottom: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
              {session.user?.name?.[0] || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{session.user?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>Admin</div>
            </div>
          </div>
          <a href="/api/auth/signout" style={{ display: "block", textAlign: "center", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.35)", padding: "7px", fontSize: "11px", textDecoration: "none" }}>Sign out</a>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0 28px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1A1A2E" }}>Queue</div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>All your scheduled posts</div>
          </div>
          <a href="/dashboard/compose" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 12px rgba(255,107,53,0.35)" }}>+ New Post</a>
        </div>

        <div style={{ flex: 1, padding: "28px" }}>
          <QueueList />
        </div>
      </div>
    </main>
  )
}