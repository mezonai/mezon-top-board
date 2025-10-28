import React from 'react'
import { Slider } from 'antd'
import './Slider.module.scss'
import styles from './Slider.module.scss'

interface MtbSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const MtbSlider: React.FC<MtbSliderProps> = ({
    min = 0,
    max = 100,
    step = 1,   
    value,
    onChange,
    className
}) => {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={`${styles['custom-slider']} ${className}`}
    />
  )
}

export default MtbSlider