import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

export default async function Pages() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F5", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
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
              color: item.name === "Pages" ? "white" : "rgba(255,255,255,0.45)",
              background: item.name === "Pages" ? "rgba(255,107,53,0.2)" : "transparent",
              borderLeft: item.name === "Pages" ? "3px solid #FF6B35" : "3px solid transparent",
              marginBottom: "2px", fontSize: "13px", fontWeight: item.name === "Pages" ? "600" : "400",
            }}>
              <span style={{ fontSize: "15px", width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", marginBottom: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "700" }}>
              {session.user?.name?.[0] || "U"}
            </div>
            <div>
              <div style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>{session.user?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>Admin</div>
            </div>
          </div>
          <a href="/api/auth/signout" style={{ display: "block", textAlign: "center", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.35)", padding: "7px", fontSize: "11px", textDecoration: "none" }}>Sign out</a>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0 28px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1A1A2E" }}>Connected Pages</div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "1px" }}>{session.pages?.length || 0} pages connected via Facebook</div>
          </div>
          <a href="/dashboard/compose" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", borderRadius: "10px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 12px rgba(255,107,53,0.35)" }}>+ New Post</a>
        </div>

        <div style={{ flex: 1, padding: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {(session.pages || []).map((page) => (
              <div key={page.id} style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#1877F2", fontWeight: "700" }}>f</div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#1A1A2E", textAlign: "center" }}>{page.name}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>Facebook Page</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ECFDF5", borderRadius: "20px", padding: "4px 12px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></div>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: "600" }}>Connected</span>
                </div>
                <a href="/dashboard/compose" style={{ marginTop: "4px", width: "100%", textAlign: "center", background: "#FFF0EB", color: "#FF6B35", borderRadius: "8px", padding: "8px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Post to this page</a>
              </div>
            ))}
          </div>

          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "18px" }}>💡</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#92400E", marginBottom: "4px" }}>Pages shown here are from your Facebook account</div>
              <div style={{ fontSize: "12px", color: "#B45309", lineHeight: "1.6" }}>Only pages where you have Admin or Editor access are shown. To add more pages, check your permissions in Facebook Business Manager.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}