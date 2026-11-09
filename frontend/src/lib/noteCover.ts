/** Keep existing Unsplash image IDs compatible with uploaded covers. */
export function noteCoverUrl(image: string) {
  return image.startsWith('data:image/jpeg;base64,') ? image : `https://images.unsplash.com/${image}?w=1200&h=600&fit=crop&auto=format&q=80`
}

export async function encodeCover(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('รองรับรูปปก JPG, PNG หรือ WebP เท่านั้น')
  if (file.size > 10 * 1024 * 1024) throw new Error('กรุณาเลือกรูปปกขนาดไม่เกิน 10 MB')
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, 960 / bitmap.width, 640 / bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('ไม่สามารถเตรียมรูปปกได้')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    for (const quality of [0.85, 0.65, 0.45, 0.25]) {
      const image = canvas.toDataURL('image/jpeg', quality)
      if (image.startsWith('data:image/jpeg;base64,') && image.length <= 87_407) return image
    }
    throw new Error('รูปปกมีรายละเอียดมากเกินไป กรุณาเลือกรูปที่เล็กลง')
  } finally {
    bitmap.close()
  }
}
