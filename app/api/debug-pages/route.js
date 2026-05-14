import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "not logged in" })

  const res = await fetch(
    `https://graph.facebook.com/me/accounts?fields=id,name,access_token,tasks&access_token=${session.accessToken}`
  )
  const data = await res.json()
  return NextResponse.json(data)
}