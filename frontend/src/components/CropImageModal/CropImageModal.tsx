import React, { useRef, useState } from 'react'
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal } from 'antd'
import MtbButton from '@app/mtb-ui/Button'
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons'
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { getCroppedImg } from '@app/utils/cropImage'
import MtbSlider from '@app/mtb-ui/Slider/Slider'

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

  function onImageLoad() {
    if (!imgRef.current) return;

    const { naturalWidth: width, naturalHeight: height } = imgRef.current;

    if (!width || !height || width === 0 || height === 0) {
      setTimeout(onImageLoad, 100); 
      return;
    }

    let initialCrop = makeAspectCrop(
      { unit: '%', width: 90 },
      aspect,
      width,
      height
    );

    if (initialCrop.height > 100) {
      initialCrop = makeAspectCrop(
        { unit: '%', height: 90 },
        aspect,
        width,
        height
      );
    }
    
    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);

    const completedPixelCrop: PixelCrop = {
        unit: 'px',
        x: (centeredCrop.x / 100) * width,
        y: (centeredCrop.y / 100) * height,
        width: (centeredCrop.width / 100) * width,
        height: (centeredCrop.height / 100) * height,
    };
    
    setCompletedCrop(completedPixelCrop);
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
        false,
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
      okText="Upload"
      cancelText="Cancel"
      confirmLoading={isProcessing || parentLoading}
      cancelButtonProps={{ disabled: parentLoading }}
      okButtonProps={{ style: { backgroundColor: '#F2385A' } }}
      maskClosable={false}
      centered
      width={600}
      bodyStyle={{ maxHeight: '70vh' }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 min-w-[200px] items-center gap-2">
          <MtbTypography 
            variant='p' 
            customClassName='!text-xs !whitespace-nowrap'
          >
            Zoom:
          </MtbTypography>
          <MtbSlider 
            min={1} 
            max={3} 
            step={0.1} 
            value={zoom} 
            onChange={setZoom} 
            className="flex-1" 
          />
        </div>

        <div className="flex flex-1 min-w-[200px] justify-end items-center gap-2">
          <MtbTypography 
            variant='p' 
            customClassName='!text-xs mr-2'
          >
            Rotate:
          </MtbTypography>
          <MtbButton 
            icon={<RotateLeftOutlined />} 
            onClick={() => handleRotate(-45)} 
          />
          <MtbButton 
            icon={<RotateRightOutlined />} 
            onClick={() => handleRotate(45)} 
          />
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
              src={imgSrc}
              alt="to crop"
              onLoad={(e) => {
                imgRef.current = e.currentTarget
                onImageLoad()
              }}
              style={{
                display: 'block',
                maxHeight: '60vh',
                width: 'auto',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
          </ReactCrop>
        </div>
      )}
    </Modal>
  )
}

export default CropImageModal
