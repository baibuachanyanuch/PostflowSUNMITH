"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CalendarView({ initialPosts }) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const postsByDate = {}
  initialPosts.forEach(post => {
    const date = new Date(post.scheduled_publish_time * 1000)
    if (date.getFullYear() === year && date.getMonth() === month) {
      const key = date.getDate()
      if (!postsByDate[key]) postsByDate[key] = []
      postsByDate[key].push(post)
    }
  })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    router.push(`/dashboard/compose?date=${dateStr}`)
  }

  const isToday = (day) => {
    return day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
  }

  const isPast = (day) => {
    const d = new Date(year, month, day)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  return (
    <div style={{ background: "white", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>

      {/* Calendar Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={prevMonth} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#1A1A2E" }}>{monthName}</span>
        <button onClick={nextMonth} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} style={{ padding: "10px 8px", textAlign: "center", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map((day, i) => {
          const dayPosts = day ? (postsByDate[day] || []) : []
          const hasPosts = dayPosts.length > 0
          const past = day ? isPast(day) : false

          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              style={{
                minHeight: "100px",
                padding: "8px",
                borderRight: (i + 1) % 7 !== 0 ? "1px solid rgba(0,0,0,0.04)" : "none",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                background: day ? (past ? "#fafafa" : "white") : "#FAFAFA",
                cursor: day ? "pointer" : "default",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (day && !past) e.currentTarget.style.background = "#FFF0EB" }}
              onMouseLeave={e => { if (day && !past) e.currentTarget.style.background = "white" }}
            >
              {day && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: isToday(day) ? "linear-gradient(135deg, #FF6B35, #FF8C5A)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "12px", fontWeight: isToday(day) ? "700" : "500", color: isToday(day) ? "white" : past ? "#9ca3af" : "#1A1A2E" }}>{day}</span>
                    </div>
                    {!past && (
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#FF6B35", opacity: 0.6 }}>+</div>
                    )}
                  </div>

                  {dayPosts.slice(0, 2).map((post, pi) => (
                    <div key={pi} style={{ background: "#FFF0EB", borderLeft: "3px solid #FF6B35", borderRadius: "4px", padding: "3px 6px", marginBottom: "3px", fontSize: "10px", color: "#FF6B35", fontWeight: "600", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {new Date(post.scheduled_publish_time * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} · {post.pageName}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div style={{ fontSize: "10px", color: "#9ca3af", padding: "2px 4px" }}>+{dayPosts.length - 2} more</div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}