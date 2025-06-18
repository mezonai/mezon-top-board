import { getUrlMedia } from '@app/utils/stringHelper'

export function transformMediaSrc(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const images = doc.querySelectorAll('img')
  images.forEach((img) => {
    const rawSrc = img.getAttribute('src')
    if (rawSrc && rawSrc.startsWith('/')) {
      img.setAttribute('src', getUrlMedia(rawSrc))
      const existingStyle = img.getAttribute('style') || ''
      img.setAttribute('style', `${existingStyle}; max-width: 100%;`.trim())
    }
  })

  return doc.body.innerHTML
}
