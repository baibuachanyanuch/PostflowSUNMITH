export default async function SignIn({ searchParams }) {
  const params = await searchParams
  const error = params?.error

  return (
    <main style={{ minHeight: "100vh", background: "#FFF8F5", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ flex: 1, background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,107,53,0.08)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "300px", height: "300px", background: "rgba(255,107,53,0.05)", borderRadius: "50%" }}></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "60px" }}>
            <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "18px" }}>P</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>PostFlow</span>
          </div>
          <h1 style={{ color: "white", fontSize: "40px", fontWeight: "800", lineHeight: "1.2", marginBottom: "20px", letterSpacing: "-1px" }}>
            Manage all your<br />
            <span style={{ color: "#FF6B35" }}>Facebook Pages</span><br />
            in one place.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: "1.7", marginBottom: "48px", maxWidth: "400px" }}>
            Schedule posts, manage multiple pages, and collaborate with your team.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "📅", text: "Schedule posts in advance" },
              { icon: "📄", text: "Manage up to 20+ pages at once" },
              { icon: "👥", text: "Collaborate with your team" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,107,53,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{item.icon}</div>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#1A1A2E", marginBottom: "8px", letterSpacing: "-0.5px" }}>Welcome back</h2>
            <p style={{ fontSize: "14px", color: "#9ca3af" }}>Sign in to your PostFlow account</p>
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#dc2626" }}>
              ⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งครับ
            </div>
          )}

          <a href="/api/auth/signin/facebook" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            width: "100%", background: "#1877F2", color: "white",
            borderRadius: "12px", padding: "16px 24px",
            fontSize: "15px", fontWeight: "600", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(24,119,242,0.3)",
            marginBottom: "16px", boxSizing: "border-box",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </a>

          <div style={{ textAlign: "center", padding: "16px 0", color: "#9ca3af", fontSize: "12px" }}>
            By signing in, you agree to our Terms of Service
          </div>

          <div style={{ background: "#FFF0EB", borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px" }}>💡</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#FF6B35", marginBottom: "2px" }}>First time?</div>
              <div style={{ fontSize: "12px", color: "#92400e", lineHeight: "1.5" }}>After signing in, you'll be asked to connect your Facebook Pages in the next step.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}