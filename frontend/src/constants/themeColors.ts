export const THEME_COLORS = {
  red:    '#F2385A', 
  pink:   '#E91E63',
  purple: '#9C27B0',
  blue:   '#1890FF',
  green:  '#52C41A',
  yellow: '#FADB14',
  orange: '#FA8C16',
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;

type ColorOption = {
  key: ThemeColorKey; 
  label: string;
  tailwindClass: string;
};

export const COLOR_OPTIONS: ColorOption[] = [
  { key: "red",    label: "colors.red",    tailwindClass: "bg-[#F2385A]" },
  { key: "pink",   label: "colors.pink",   tailwindClass: "bg-[#E91E63]" },
  { key: "purple", label: "colors.purple", tailwindClass: "bg-[#9C27B0]" },
  { key: "blue",   label: "colors.blue",   tailwindClass: "bg-[#1890FF]" },
  { key: "green",  label: "colors.green",  tailwindClass: "bg-[#52C41A]" },
  { key: "yellow", label: "colors.yellow", tailwindClass: "bg-[#FADB14]" },
  { key: "orange", label: "colors.orange", tailwindClass: "bg-[#FA8C16]" },
];