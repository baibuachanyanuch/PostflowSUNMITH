"use client"
import { useState, useEffect } from "react"

export default function ComposeForm({ pages, accessToken, userName, userAvatar, presetDate }) {
  const [selectedPages, setSelectedPages] = useState([])
  const [mainCaption, setMainCaption] = useState("")
  const [syncAll, setSyncAll] = useState(true)
  const [pageCaptions, setPageCaptions] = useState({})
  const [scheduleDate, setScheduleDate] = useState(presetDate || "")
  const [scheduleTime, setScheduleTime] = useState("")
  const [link, setLink] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [previewPage, setPreviewPage] = useState(null)

  // sync main caption ไปทุกเพจที่เลือกถ้า syncAll = true
  useEffect(() => {
    if (syncAll && selectedPages.length > 0) {
      const updated = {}
      selectedPages.forEach(id => { updated[id] = mainCaption })
      setPageCaptions(updated)
    }
  }, [mainCaption, syncAll, selectedPages])

  // พอเลือกเพจใหม่ ให้ set preview เป็นเพจแรก
  useEffect(() => {
    if (selectedPages.length > 0 && !previewPage) {
      setPreviewPage(selectedPages[0])
    }
    if (selectedPages.length === 0) setPreviewPage(null)
  }, [selectedPages])

  const togglePage = (pageId) => {
    setSelectedPages(prev => {
      const next = prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
      if (!prev.includes(pageId) && syncAll) {
        setPageCaptions(c => ({ ...c, [pageId]: mainCaption }))
      }
      return next
    })
  }

  const handlePageCaption = (pageId, value) => {
    setPageCaptions(prev => ({ ...prev, [pageId]: value }))
  }

  const handleSyncToggle = () => {
    const next = !syncAll
    setSyncAll(next)
    if (next) {
      const updated = {}
      selectedPages.forEach(id => { updated[id] = mainCaption })
      setPageCaptions(updated)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImages(prev => [...prev, { file, preview: ev.target.result }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (isDraft) => {
    if (selectedPages.length === 0) return alert("Please select at least one page")
    const hasCaption = selectedPages.every(id => pageCaptions[id]?.trim())
    if (!hasCaption) return alert("Please fill in caption for all selected pages")

    setLoading(true)
    try {
      // โพสทีละเพจพร้อม caption ของตัวเอง
      const results = []
      for (const pageId of selectedPages) {
        const caption = link ? `${pageCaptions[pageId]}\n\n${link}` : pageCaptions[pageId]
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: caption,
            selectedPages: [pageId],
            scheduleDate, scheduleTime,
            isDraft, pages, accessToken, link,
            images: images.map(img => img.preview),
          }),
        })
        const data = await res.json()
        results.push(data)
      }
      const allSuccess = results.every(r => !r.error)
      setResult({ message: allSuccess ? "โพสสำเร็จทุกเพจแล้วครับ! 🎉" : "บางเพจมีปัญหา กรุณาเช็คอีกครั้ง" })
      if (allSuccess) {
        setMainCaption(""); setPageCaptions({}); setSelectedPages([])
        setLink(""); setImages([]); setScheduleDate(""); setScheduleTime("")
      }
    } catch (err) {
      setResult({ error: "Something went wrong" })
    }
    setLoading(false)
  }

  const previewCaption = previewPage ? (pageCaptions[previewPage] || "") : mainCaption
  const previewPageObj = pages.find(p => p.id === previewPage) || pages.find(p => p.id === selectedPages[0])

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", maxWidth: "1100px" }}>

      {/* LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {result && (
          <div style={{ background: result.error ? "#fee2e2" : "#dcfce7", border: `1px solid ${result.error ? "#fca5a5" : "#86efac"}`, borderRadius: "12px", padding: "14px 16px", fontSize: "13px", color: result.error ? "#dc2626" : "#15803d" }}>
            {result.error || result.message}
          </div>
        )}

        {/* Select Pages */}
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
                {selectedPages.includes(page.id) && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Caption */}
        <div style={{ background: "white", borderRadius: "14px", border: "2px solid #FF6B35", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Main Caption
            </div>
            <div onClick={handleSyncToggle} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "6px 12px", borderRadius: "8px", background: syncAll ? "#FFF0EB" : "#f9fafb", border: `1.5px solid ${syncAll ? "#FF6B35" : "rgba(0,0,0,0.08)"}` }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: syncAll ? "#FF6B35" : "white", border: `2px solid ${syncAll ? "#FF6B35" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {syncAll && <span style={{ color: "white", fontSize: "10px", fontWeight: "700" }}>✓</span>}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: syncAll ? "#FF6B35" : "#6b7280" }}>
                Sync to all pages
              </span>
            </div>
          </div>
          <textarea
            value={mainCaption}
            onChange={(e) => setMainCaption(e.target.value)}
            placeholder="Write main caption here... ถ้าติ๊ก Sync จะไปทุกเพจเลย 🎉"
            style={{ width: "100%", minHeight: "120px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: "1.7" }}
            onFocus={e => e.target.style.borderColor = "#FF6B35"}
            onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"}
          />
          {syncAll && selectedPages.length > 0 && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "#FF6B35", background: "#FFF0EB", padding: "6px 10px", borderRadius: "6px" }}>
              ✓ Syncing to {selectedPages.length} page{selectedPages.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Per-page captions (ถ้าไม่ sync) */}
        {!syncAll && selectedPages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Caption per page
            </div>
            {selectedPages.map(pageId => {
              const page = pages.find(p => p.id === pageId)
              return (
                <div key={pageId} style={{ background: "white", borderRadius: "14px", border: `1.5px solid ${previewPage === pageId ? "#FF6B35" : "rgba(0,0,0,0.06)"}`, padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#1877F2", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: "800" }}>f</span> {page?.name}
                    </div>
                    <div onClick={() => setPreviewPage(pageId)} style={{ fontSize: "11px", cursor: "pointer", padding: "4px 10px", borderRadius: "6px", background: previewPage === pageId ? "#FFF0EB" : "#f9fafb", color: previewPage === pageId ? "#FF6B35" : "#9ca3af", border: `1px solid ${previewPage === pageId ? "#FF6B35" : "rgba(0,0,0,0.08)"}`, fontWeight: "600" }}>
                      {previewPage === pageId ? "Previewing" : "Preview"}
                    </div>
                  </div>
                  <textarea
                    value={pageCaptions[pageId] || ""}
                    onChange={(e) => handlePageCaption(pageId, e.target.value)}
                    placeholder={`Caption สำหรับ ${page?.name}...`}
                    style={{ width: "100%", minHeight: "100px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: "1.7" }}
                    onFocus={e => { e.target.style.borderColor = "#FF6B35"; setPreviewPage(pageId) }}
                    onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"}
                  />
                  <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "4px" }}>
                    {(pageCaptions[pageId] || "").length} characters
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Images */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Images</div>
          {images.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={img.preview} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }} />
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

        {/* Link */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>Link (Optional)</div>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..."
            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#FF6B35"}
            onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.08)"}
          />
        </div>

        {/* Schedule */}
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

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={() => handleSubmit(true)} disabled={loading} style={{ padding: "11px 22px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>
            Save as Draft
          </button>
          <button onClick={() => handleSubmit(false)} disabled={loading} style={{ padding: "11px 24px", borderRadius: "10px", border: "none", background: loading ? "#ffb89a" : "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(255,107,53,0.35)" }}>
            {loading ? "Posting..." : scheduleDate ? "📅 Schedule Post" : "🚀 Post Now"}
          </button>
        </div>
      </div>

      {/* RIGHT — Preview */}
      <div style={{ position: "sticky", top: "0", alignSelf: "start" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Facebook Preview
          {!syncAll && selectedPages.length > 0 && (
            <span style={{ marginLeft: "8px", color: "#FF6B35", fontSize: "10px" }}>
              — {previewPageObj?.name}
            </span>
          )}
        </div>
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
              {previewPageObj?.name?.[0] || "P"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>
                {previewPageObj?.name || "Select a page..."}
              </div>
              <div style={{ fontSize: "11px", color: "#65676b" }}>
                {scheduleDate && scheduleTime ? new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Just now"} · 🌐
              </div>
            </div>
            <div style={{ fontSize: "18px", color: "#65676b" }}>···</div>
          </div>
          <div style={{ padding: "0 14px 12px" }}>
            {previewCaption ? (
              <div style={{ fontSize: "15px", color: "#1c1e21", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {link ? `${previewCaption}\n\n${link}` : previewCaption}
              </div>
            ) : (
              <div style={{ fontSize: "14px", color: "#bec3c9", fontStyle: "italic" }}>Your caption will appear here...</div>
            )}
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
          <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>👍</span><span style={{ fontSize: "16px" }}>❤️</span><span style={{ fontSize: "16px" }}>😆</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "8px", display: "flex", justifyContent: "space-around" }}>
              {["👍 Like", "💬 Comment", "↗️ Share"].map(action => (
                <span key={action} style={{ fontSize: "13px", fontWeight: "600", color: "#65676b" }}>{action}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Page switcher for preview */}
        {!syncAll && selectedPages.length > 1 && (
          <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {selectedPages.map(id => {
              const page = pages.find(p => p.id === id)
              return (
                <div key={id} onClick={() => setPreviewPage(id)} style={{ padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600", background: previewPage === id ? "#FFF0EB" : "#f9fafb", color: previewPage === id ? "#FF6B35" : "#9ca3af", border: `1px solid ${previewPage === id ? "#FF6B35" : "rgba(0,0,0,0.08)"}` }}>
                  {page?.name?.split(" ")[0]}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}