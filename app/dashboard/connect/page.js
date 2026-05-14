import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

export default async function Connect() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")
  if (session.pages?.length > 0) redirect("/dashboard")

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.08)", padding: "48px 40px", width: "400px", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "22px", margin: "0 auto 20px" }}>P</div>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1A1A2E", marginBottom: "8px" }}>Connect your Pages</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "32px", lineHeight: "1.6" }}>
          กด Connect เพื่อเชื่อมต่อ Facebook Pages ของคุณ ระบบจะขอสิทธิ์จัดการเพจที่คุณเป็น Admin
        </p>
        <a href="/api/auth/signin/facebook-pages" style={{ display: "block", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", borderRadius: "10px", padding: "14px 20px", fontSize: "15px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 12px rgba(255,107,53,0.35)", marginBottom: "12px" }}>
          🔗 Connect Facebook Pages
        </a>
        <a href="/dashboard" style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none" }}>Skip for now</a>
      </div>
    </main>
  )
}