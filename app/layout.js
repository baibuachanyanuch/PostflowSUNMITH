export const metadata = {
  title: "PostFlow",
  description: "Social media management สำหรับทีม",
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  )
}