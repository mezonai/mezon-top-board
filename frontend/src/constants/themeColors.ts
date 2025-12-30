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
  { key: "red",    label: "Red",    tailwindClass: "bg-[#F2385A]" },
  { key: "pink",   label: "Pink",   tailwindClass: "bg-[#E91E63]" },
  { key: "purple", label: "Purple", tailwindClass: "bg-[#9C27B0]" },
  { key: "blue",   label: "Blue",   tailwindClass: "bg-[#1890FF]" },
  { key: "green",  label: "Green",  tailwindClass: "bg-[#52C41A]" },
  { key: "yellow", label: "Yellow", tailwindClass: "bg-[#FADB14]" },
  { key: "orange", label: "Orange", tailwindClass: "bg-[#FA8C16]" },
];