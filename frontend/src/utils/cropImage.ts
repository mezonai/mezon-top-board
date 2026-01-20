import { PixelCrop } from 'react-image-crop'

export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  rotation = 0,
  zoom = 1,
  circular = false,
  mimeType = 'image/png',
  quality = 0.95
): Promise<File | null> {
  if (!image || !crop || crop.width === 0 || crop.height === 0) {
    console.error("Invalid crop dimensions or image element provided.");
    return null;
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error("Could not get 2d context from canvas");
    return null
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio || 1

  const outputWidth = Math.floor(crop.width * scaleX * pixelRatio)
  const outputHeight = Math.floor(crop.height * scaleY * pixelRatio)

  canvas.width = outputWidth
  canvas.height = outputHeight

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropCenterX = crop.x + crop.width / 2
  const cropCenterY = crop.y + crop.height / 2

  const centerX = outputWidth / (2 * pixelRatio)
  const centerY = outputHeight / (2 * pixelRatio)

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(zoom, zoom)
  ctx.translate(-cropCenterX * scaleX, -cropCenterY * scaleY)

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  )

  ctx.restore()

  if (circular) {
    ctx.globalCompositeOperation = 'destination-in'
    
    ctx.beginPath()
    const radius = Math.min(outputWidth, outputHeight) / (2 * pixelRatio)
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas is empty')
          resolve(null)
          return
        }
        const file = new File([blob], fileName, { type: mimeType })
        resolve(file)
      },
      mimeType,
      quality
    )
  })
}