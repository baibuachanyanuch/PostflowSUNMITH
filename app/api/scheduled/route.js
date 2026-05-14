import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "not logged in" })

  const allPosts = []

  for (const page of session.pages || []) {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${page.id}/scheduled_posts?fields=id,message,scheduled_publish_time,attachments&access_token=${page.access_token}`
    )
    const data = await res.json()

    if (data.data) {
      data.data.forEach(post => {
        allPosts.push({
          ...post,
          pageName: page.name,
          pageId: page.id,
          pageToken: page.access_token,
        })
      })
    }
  }

  return NextResponse.json({ posts: allPosts })
}

export async function DELETE(req) {
  const { postId, pageToken } = await req.json()

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${postId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: pageToken }),
    }
  )
  const data = await res.json()
  return NextResponse.json(data)
}