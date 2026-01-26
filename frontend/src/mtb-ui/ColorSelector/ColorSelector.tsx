import { TAG_COLOR_MAP, TAG_COLORS } from "@app/constants/colors"
import { ColorPicker } from "antd"
import { ColorSelectorProps } from "./ColorSelector.types"

export const ColorSelector = ({ value, onChange, disabled }: ColorSelectorProps) => {
  const isCustom = value?.includes('#')

  return (
    <ColorPicker
      value={isCustom ? value : TAG_COLOR_MAP[value!] || TAG_COLORS.DEFAULT}
      placement="rightBottom"
      onChange={(e) => onChange?.(e.toHexString())}
      disabled={disabled}
    />
  )
}