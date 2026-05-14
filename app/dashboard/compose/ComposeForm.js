"use client"
import { useState } from "react"

export default function ComposeForm({ pages, accessToken, userName, userAvatar, presetDate }) {
  const [selectedPages, setSelectedPages] = useState([])
  const [message, setMessage] = useState("")
  const [scheduleDate, setScheduleDate] = useState(presetDate || "")
  const [scheduleTime, setScheduleTime] = useState("")
  const [link, setLink] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const togglePage = (pageId) => {
    setSelectedPages(prev =>
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, { file, preview: ev.target.result, name: file.name }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (isDraft) => {
    if (!message) return alert("Please add a caption first")
    if (selectedPages.length === 0) return alert("Please select at least one page")
    setLoading(true)
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: link ? `${message}\n\n${link}` : message,
          selectedPages, scheduleDate, scheduleTime,
          isDraft, pages, accessToken, link,
          images: images.map(img => img.preview),
        }),
      })
      const data = await res.json()
      setResult(data)
      if (!data.error) {
        setMessage(""); setSelectedPages([]); setLink("")
        setImages([]); setScheduleDate(""); setScheduleTime("")
      }
    } catch (err) {
      setResult({ error: "Something went wrong" })
    }
    setLoading(false)
  }

  const selectedPage = pages.find(p => p.id === selectedPages[0])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", maxWidth: "1100px" }}>

      {/* LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {result && (
          <div style={{ background: result.error ? "#fee2e2" : "#dcfce7", border: `1px solid ${result.error ? "#fca5a5" : "#86efac"}`, borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: result.error ? "#dc2626" : "#15803d" }}>
            {result.error || result.message}
          </div>
        )}

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Post to Pages</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {pages.map((page) => (
              <div key={page.id} onClick={() => togglePage(page.id)} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
                border: `2px solid ${selectedPages.includes(page.id) ? "#FF6B35" : "rgba(0,0,0,0.08)"}`,
                background: selectedPages.includes(page.id) ? "#FFF0EB" : "#f9fafb",
                fontSize: "13px", fontWeight: "500",
                color: selectedPages.includes(page.id) ? "#FF6B35" : "#374151",
                transition: "all 0.15s",
              }}>
                <span style={{ fontWeight: "800", color: "#1877F2" }}>f</span>
                {page.name}
                {selectedPages.includes(page.id) && <span style={{ fontSize: "11px" }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Caption</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your caption here... 🎉"
            style={{ width: "100%", minHeight: "140px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: "1.7", transition: "border 0.15s" }}
            onFocus={e => e.target.style.borderColor = "#FF6B35"}
            onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"}
          />
          <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "6px" }}>{message.length} characters</div>
        </div>

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Images</div>
          {images.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={img.preview} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)" }} />
                  <div onClick={() => removeImage(i)} style={{ position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", background: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontSize: "11px", fontWeight: "700" }}>×</div>
                </div>
              ))}
            </div>
          )}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", border: "1.5px dashed rgba(0,0,0,0.12)", borderRadius: "10px", cursor: "pointer", color: "#9ca3af", fontSize: "13px", background: "#fafafa" }}>
            📷 Add Images
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
        </div>

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Link (Optional)</div>
          <input
            type="url" value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border 0.15s" }}
            onFocus={e => e.target.style.borderColor = "#FF6B35"}
            onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"}
          />
        </div>

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Schedule (Optional)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} style={{ padding: "10px 14px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
            <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ padding: "10px 14px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
          </div>
          {scheduleDate && scheduleTime && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#FF6B35", background: "#FFF0EB", padding: "8px 12px", borderRadius: "8px", fontWeight: "500" }}>
              📅 Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={() => handleSubmit(true)} disabled={loading} style={{ padding: "11px 22px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>
            Save as Draft
          </button>
          <button onClick={() => handleSubmit(false)} disabled={loading} style={{ padding: "11px 24px", borderRadius: "10px", border: "none", background: loading ? "#ffb89a" : "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(255,107,53,0.35)" }}>
            {loading ? "Posting..." : scheduleDate ? "📅 Schedule Post" : "🚀 Post Now"}
          </button>
        </div>
      </div>

      {/* RIGHT — Facebook Preview */}
      <div style={{ position: "sticky", top: "0", alignSelf: "start" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Facebook Preview</div>
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.1)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ background: "#1877F2", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>f</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}></div>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}></div>
            </div>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>
              {selectedPage?.name?.[0] || "P"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>
                {selectedPage?.name || "Select a page..."}
              </div>
              <div style={{ fontSize: "11px", color: "#65676b" }}>
                {scheduleDate && scheduleTime
                  ? new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                  : "Just now"
                } · 🌐
              </div>
            </div>
            <div style={{ fontSize: "18px", color: "#65676b" }}>···</div>
          </div>
          <div style={{ padding: "0 14px 12px" }}>
            {message ? (
              <div style={{ fontSize: "15px", color: "#1c1e21", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{message}</div>
            ) : (
              <div style={{ fontSize: "14px", color: "#bec3c9", fontStyle: "italic" }}>Your caption will appear here...</div>
            )}
            {link && <div style={{ marginTop: "6px", fontSize: "13px", color: "#1877F2" }}>{link}</div>}
          </div>
          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: images.length === 1 ? "1fr" : "1fr 1fr", gap: "2px" }}>
              {images.slice(0, 4).map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={img.preview} alt="" style={{ width: "100%", height: images.length === 1 ? "220px" : "130px", objectFit: "cover", display: "block" }} />
                  {i === 3 && images.length > 4 && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px", fontWeight: "700" }}>+{images.length - 4}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {link && !images.length && (
            <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderLeft: "none", borderRight: "none" }}>
              <div style={{ background: "#f0f2f5", padding: "10px 14px" }}>
                <div style={{ fontSize: "11px", color: "#65676b", textTransform: "uppercase", marginBottom: "2px" }}>{link.replace(/^https?:\/\//, "").split("/")[0]}</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1c1e21" }}>Link Preview</div>
              </div>
            </div>
          )}
          <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>👍</span>
              <span style={{ fontSize: "16px" }}>❤️</span>
              <span style={{ fontSize: "16px" }}>😆</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "8px", display: "flex", justifyContent: "space-around" }}>
              {["👍 Like", "💬 Comment", "↗️ Share"].map(action => (
                <span key={action} style={{ fontSize: "13px", fontWeight: "600", color: "#65676b" }}>{action}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}