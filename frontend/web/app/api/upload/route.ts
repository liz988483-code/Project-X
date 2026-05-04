import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) {
    return NextResponse.json({ error: 'CLOUDINARY_CLOUD_NAME is required' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A file field is required' }, { status: 400 })
  }

  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('folder', process.env.CLOUDINARY_UPLOAD_FOLDER || 'soko')

  if (apiKey && apiSecret) {
    const timestamp = Math.round(Date.now() / 1000).toString()
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'soko'
    const signature = crypto
      .createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex')

    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', timestamp)
    uploadForm.append('signature', signature)
  } else if (uploadPreset) {
    uploadForm.append('upload_preset', uploadPreset)
  } else {
    return NextResponse.json(
      { error: 'Configure CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET or CLOUDINARY_UPLOAD_PRESET' },
      { status: 500 }
    )
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: uploadForm,
  })

  const result = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: result.error?.message || 'Cloudinary upload failed' },
      { status: response.status }
    )
  }

  return NextResponse.json({
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  })
}
