import { TAG_COLOR_MAP, TAG_COLORS, TAG_PRESET_COLORS } from "@app/constants/colors"
import { ColorPicker, Select } from "antd"

interface ColorSelectorProps {
  value?: string
  onChange?: (value: string) => void
}

export const ColorSelector = ({value, onChange}: ColorSelectorProps) => {
  const isCustom = value?.includes('#')

  return (
    <div className='flex gap-2'>
        <Select
            options={[...TAG_PRESET_COLORS.map((color)=> ({value: color, label: color})), { value: 'custom', label: 'custom' }]}
            value={isCustom ? 'custom' : value}
            onChange={(value) => onChange?.(value)}
            popupMatchSelectWidth={false}
        />
        <ColorPicker
            value={isCustom ? value : TAG_COLOR_MAP[value!] || TAG_COLORS.DEFAULT} 
            onChange={(e) => onChange?.(e.toHexString())}
        />
    </div>
  )
}