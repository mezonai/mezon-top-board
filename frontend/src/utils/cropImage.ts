import { PixelCrop } from 'react-image-crop'

export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  rotation = 0,
  scale = 1,
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
  const cropWidthNatural = crop.width * scaleX
  const cropHeightNatural = crop.height * scaleY
  const outputWidth = Math.max(1, Math.ceil(crop.width * scale));
  const outputHeight = Math.max(1, Math.ceil(crop.height * scale));


  canvas.width = Math.ceil(outputWidth * pixelRatio)
  canvas.height = Math.ceil(outputHeight * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'
  const rotationRads = rotation * (Math.PI / 180)
  const centerX = outputWidth / 2
  const centerY = outputHeight / 2

  ctx.translate(centerX, centerY)
  if (rotation !== 0) {
    ctx.rotate(rotationRads)
  }
  ctx.translate(-centerX, -centerY)

  try {
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      console.error("Image natural dimensions are zero.");
      return null;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      cropWidthNatural,
      cropHeightNatural,
      0,
      0,
      outputWidth,
      outputHeight
    )
  } catch (err) {
    console.error('drawImage failed', err)
    return null
  }

  if (circular) {
    ctx.translate(centerX, centerY)
    ctx.rotate(-rotationRads)
    ctx.translate(-centerX, -centerY)

    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    const radius = Math.min(outputWidth, outputHeight) / 2
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.globalCompositeOperation = 'source-over'
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed'))
          return
        }
        const croppedFile = new File([blob], fileName, { type: mimeType })
        resolve(croppedFile)
      },
      mimeType,
      quality
    )
  })
}
