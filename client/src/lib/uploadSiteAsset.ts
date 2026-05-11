/** Direct upload to Cloudinary (unsigned preset). */
export async function uploadSiteAsset(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    throw new Error(
      'VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET must be set',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  const data = (await response.json()) as {
    secure_url?: string
    error?: { message?: string }
  }

  if (!response.ok) {
    const msg =
      typeof data.error?.message === 'string'
        ? data.error.message
        : 'Оруулалт амжилтгүй'
    throw new Error(msg)
  }

  if (!data.secure_url) throw new Error('Оруулалт амжилтгүй')
  return data.secure_url
}
