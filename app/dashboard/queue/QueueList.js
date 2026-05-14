"use client"
import { useState, useEffect } from "react"

export default function QueueList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const res = await fetch("/api/scheduled")
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  const handleDelete = async (postId, pageToken) => {
    if (!confirm("Cancel this scheduled post?")) return
    setDeleting(postId)
    await fetch("/api/scheduled", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, pageToken }),
    })
    await fetchPosts()
    setDeleting(null)
  }

  if (loading) return (
    <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "60px", textAlign: "center" }}>
      <div style={{ fontSize: "24px", marginBottom: "12px" }}>⏳</div>
      <div style={{ fontSize: "14px", color: "#9ca3af" }}>Loading scheduled posts...</div>
    </div>
  )

  if (posts.length === 0) return (
    <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "60px", textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "#1A1A2E", marginBottom: "6px" }}>No scheduled posts</div>
      <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>Schedule your first post to see it here</div>
      <a href="/dashboard/compose" style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", borderRadius: "10px", padding: "10px 24px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>+ New Post</a>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "4px" }}>{posts.length} post{posts.length > 1 ? "s" : ""} scheduled</div>
      {posts.map((post) => (
        <div key={post.id} style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
          
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1877F2", fontWeight: "800", fontSize: "18px", flexShrink: 0 }}>f</div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#1877F2", marginBottom: "4px" }}>{post.pageName}</div>
            <div style={{ fontSize: "14px", color: "#1A1A2E", lineHeight: "1.5", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {post.message || "(No caption)"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ background: "#FFF0EB", color: "#FF6B35", fontSize: "11px", padding: "4px 10px", borderRadius: "6px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                📅 {new Date(post.scheduled_publish_time * 1000).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span style={{ background: "#F0EFFE", color: "#6C63FF", fontSize: "11px", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
                Scheduled
              </span>
            </div>
          </div>

          <button
            onClick={() => handleDelete(post.id, post.pageToken)}
            disabled={deleting === post.id}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #fca5a5", background: "white", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}
          >
            {deleting === post.id ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  )
}