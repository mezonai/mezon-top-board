import React from 'react'
import { Slider } from 'antd'
import styles from './Slider.module.scss'
import { cn } from '@app/utils/cn'

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
            className={cn(styles['custom-slider'], className)}
        />
    )
}

export default MtbSlider