import { NextResponse } from "next/server"

export async function POST(req) {
  const { message, selectedPages, scheduleDate, scheduleTime, isDraft, pages, images } = await req.json()

  if (isDraft) {
    return NextResponse.json({ message: "บันทึก Draft เรียบร้อยแล้วครับ" })
  }

  try {
    const results = []

    for (let i = 0; i < selectedPages.length; i++) {
      const pageId = selectedPages[i]
      const page = pages.find(p => p.id === pageId)
      if (!page) continue

      const pageToken = page.access_token

      try {
        let photoIds = []

        if (images && images.length > 0) {
          for (const imageBase64 of images) {
            const matches = imageBase64.match(/^data:(.+);base64,(.+)$/)
            if (!matches) continue

            const mimeType = matches[1]
            const base64Data = matches[2]
            const buffer = Buffer.from(base64Data, "base64")

            const formData = new FormData()
            const blob = new Blob([buffer], { type: mimeType })
            formData.append("source", blob, "photo.jpg")
            formData.append("published", "false")
            formData.append("access_token", pageToken)

            const photoRes = await fetch(
              `https://graph.facebook.com/v19.0/${pageId}/photos`,
              { method: "POST", body: formData }
            )
            const photoData = await photoRes.json()
            console.log("Photo upload:", photoData)

            if (photoData.id) {
              photoIds.push({ media_fbid: photoData.id })
            }
          }
        }

        const postBody = {
          access_token: pageToken,
          message,
        }

        if (scheduleDate && scheduleTime) {
          const localDate = new Date(`${scheduleDate}T${scheduleTime}:00+07:00`)
          const scheduledTime = Math.floor(localDate.getTime() / 1000)
          const now = Math.floor(Date.now() / 1000)

          if (scheduledTime < now + 600) {
            results.push({ page: page.name, error: "เวลาต้องเป็นอนาคตอย่างน้อย 10 นาทีครับ" })
            continue
          }

          if (scheduledTime > now + 15897600) {
            results.push({ page: page.name, error: "เวลาต้องไม่เกิน 6 เดือนครับ" })
            continue
          }

          postBody.published = false
          postBody.scheduled_publish_time = scheduledTime
        }

        if (photoIds.length > 0) {
          postBody.attached_media = JSON.stringify(photoIds)
        }

        const postRes = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}/feed`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postBody),
          }
        )

        const postData = await postRes.json()
        console.log(`Page ${page.name}:`, postData)

        if (postData.error) {
          results.push({ page: page.name, error: postData.error.message })
        } else {
          results.push({ page: page.name, success: true, id: postData.id })
        }

      } catch (pageErr) {
        results.push({ page: page.name, error: pageErr.message })
      }
    }

    const hasError = results.some(r => r.error)
    const successPages = results.filter(r => r.success).map(r => r.page)
    const errorPages = results.filter(r => r.error).map(r => `${r.page}: ${r.error}`)

    return NextResponse.json({
      message: hasError
        ? `โพสสำเร็จ: ${successPages.join(", ")} | ล้มเหลว: ${errorPages.join(", ")}`
        : `โพสสำเร็จทุกเพจแล้วครับ! 🎉`,
      results,
    })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}