import ReactQuill, { Value } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useCallback, useRef } from 'react'
import { imageMimeTypes } from '@app/constants/mimeTypes'
import { toast } from 'react-toastify'
import { getUrlMedia } from '@app/utils/stringHelper'

export const isMimeTypeValid = (mimeType: string, mimeTypes: string[]): boolean => mimeTypes.includes(mimeType)

export interface IRichTextEditorRef {
  getUploadedMediaIds: () => string[]
}

interface IRichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  customClass?: string
}

function RichTextEditor({ value = '', placeholder = 'Type here...', onChange, customClass }: IRichTextEditorProps) {
  const quillRef = useRef<ReactQuill | null>(null)
  function transformMediaSrc(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
      const rawSrc = img.getAttribute('src');
      if (rawSrc && rawSrc.startsWith('/')) {
        img.setAttribute('src', getUrlMedia(rawSrc));
      }
    });
  
    return doc.body.innerHTML;
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', imageMimeTypes.join(','))
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      if (!isMimeTypeValid(file.type, imageMimeTypes)) {
        toast.error('Please upload a valid image file!')
        return
      }

      const maxImageSize = 4 * 1024 * 1024
      if (file.size > maxImageSize) {
        toast.error(`${file.name} upload failed (exceeds 4MB)`)
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const editor = quillRef.current?.getEditor()
          const range = editor?.getSelection()
          
          if (range) {
            editor?.insertEmbed(range.index, 'image', reader.result as string)
            
            editor?.formatText(range.index, 1, {
              width: `${img.width}px`,
              height: `${img.height}px`
            })
            
            editor?.setSelection({ index: range.index + 1, length: 0 })
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        [{ align: [] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }

  const handleChange = (newContent: Value) => {
    if (onChange) onChange(newContent as string)
  }

  return (
    <ReactQuill
      ref={quillRef}
      theme='snow'
      value={transformMediaSrc(value || '')}
      onChange={handleChange}
      placeholder={placeholder}
      modules={modules}
      className={customClass}
    />
  )
}

export default RichTextEditor
