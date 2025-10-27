import React, { useRef, useState } from 'react'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button, Modal, Slider } from 'antd'
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons'
import { getCroppedImg } from '@app/utils/cropImage'

type Props = {
  open: boolean
  imgSrc: string
  originalFileName?: string
  aspect?: number
  onCancel: () => void
  onConfirm: (file: File) => void
  parentLoading?: boolean
}

const CropImageModal: React.FC<Props> = ({
  open,
  imgSrc,
  originalFileName,
  aspect = 1,
  onCancel,
  onConfirm,
  parentLoading = false
}) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const c = centerCrop(
      makeAspectCrop({ unit: '%', width: 100 }, 1, width, height),
      width,
      height
    )
    setCrop(c)
  }

  const handleRotate = (degrees: number) => {
    setRotation(prev => prev + degrees)
  }

  const handleSubmit = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) return
    setIsProcessing(true)
    try {
      const outFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        originalFileName || 'cropped-image.png',
        rotation,
        zoom,
        true,
        'image/png',
        0.95
      )
      if (outFile) onConfirm(outFile)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setZoom(1)
    setRotation(0)
    setCrop(undefined)
    setCompletedCrop(undefined)
    onCancel()
  }

  return (
    <Modal
      title="Crop Image"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Crop & Upload"
      cancelText="Cancel"
      confirmLoading={isProcessing || parentLoading}
      cancelButtonProps={{ disabled: parentLoading }}
      maskClosable={false}
      centered
      width={600}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-[200px] items-center gap-2">
          <label className="text-xs whitespace-nowrap">Zoom:</label>
          <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} className="flex-1" />
        </div>

        <div className="flex flex-1 min-w-[200px] justify-end items-center gap-2">
          <label className="text-xs mr-2">Rotate:</label>
          <Button icon={<RotateLeftOutlined />} onClick={() => handleRotate(-45)} />
          <Button icon={<RotateRightOutlined />} onClick={() => handleRotate(45)} />
        </div>
      </div>

      {imgSrc && (
        <div className="flex justify-center items-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop
          >
            <img
              ref={imgRef}
              alt="to crop"
              src={imgSrc}
              onLoad={onImageLoad}
              style={{
                display: 'block',
                maxHeight: '60vh',
                width: 'auto',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            />
          </ReactCrop>
        </div>
      )}
    </Modal>
  )
}

export default CropImageModal
