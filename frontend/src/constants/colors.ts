export const TAG_COLOR_MAP: Record<string, string> = {
  'magenta': '#eb2f96',
  'red': '#f5222d',
  'volcano': '#fa541c',
  'orange': '#fa8c16',
  'gold': '#faad14',
  'lime': '#a0d911',
  'green': '#52c41a',
  'cyan': '#13c2c2',
  'blue': '#1890ff',
  'geekblue': '#2f54eb',
  'purple': '#722ed1',
}

export const TAG_PRESET_COLORS = Object.keys(TAG_COLOR_MAP)

export const TAG_COLORS = {
  DEFAULT: TAG_PRESET_COLORS[0]
} as const