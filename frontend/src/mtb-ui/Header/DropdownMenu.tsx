import { useState } from "react";
import { RightOutlined, LeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { useTheme } from '@app/hook/useTheme'
import { useNavigate } from "react-router-dom";
import { cn } from "@app/utils/cn";
import { COLOR_OPTIONS, THEME_COLORS } from "@app/constants/themeColors";
import { lighten } from "@app/utils/colors";
import { LANGUAGES } from "@app/constants/language";
import { useTranslation } from "react-i18next";

type ViewState = "main" | "colors" | "mode" | "language";
type Mode = 'Light' | 'Dark';
const MODES: Mode[] = ['Light', 'Dark'];

type MenuItemProps = {
  label: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

const MenuItem = ({ label, icon, right, isActive, onClick, className }: MenuItemProps) => (
  <div
    onClick={onClick}
    className={cn(
      "flex-between w-full p-3 rounded-md cursor-pointer transition-base",
      !className && "hover:bg-hover",
      className
    )}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-body font-medium">{label}</span>
    </div>
    
    <div className="flex items-center gap-2 text-caption">
      {right}
      {isActive && <CheckOutlined className="text-xs" />}
    </div>
  </div>
);

const MenuHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <>
    <div 
      className="flex items-center gap-2 p-3 mb-1 cursor-pointer hover:bg-hover rounded-md transition-base" 
      onClick={onBack}
    >
      <LeftOutlined className="text-xs" />
      <span className="text-heading-5 !text-sm !font-semibold">{title}</span>
    </div>
    <Divider className="border border-border !my-1" />
  </>
);

export default function DropdownMenu({ isLogin, handleLogout }: { isLogin: boolean, handleLogout: () => void }) {
  const [view, setView] = useState<ViewState>("main")
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme()
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()

  const currentMode = theme === 'dark' ? t('header_menu.dark') : t('header_menu.light');
  const activeColorClass = COLOR_OPTIONS.find(c => c.key === primaryColor)?.tailwindClass || 'bg-red-500';
  const activeColorHex = THEME_COLORS[primaryColor as keyof typeof THEME_COLORS] || 'bg-red-500';

  return (
    <div 
      className="card-elevated bg-container w-[240px] p-2 flex flex-col gap-1 rounded-lg shadow-lg border border-border"
      onClick={(e) => e.stopPropagation()}
    >
      {view === "main" && (
        <>
          {isLogin && (
            <>
              <MenuItem 
                label={t('header_menu.profile')}
                onClick={() => { navigate(`/profile`) }} 
              />
              <div className="divider-horizontal my-1 opacity-50" />
            </>
          )}

          <MenuItem
            label={t('header_menu.colors')}
            right={
              <>
                <span
                  className={`w-4 h-4 rounded-full border-2 ${activeColorClass}`}
                  style={{ borderColor: lighten(activeColorHex, 0.4) }}
                />
                <RightOutlined className="ml-2" />
              </>
            }
            onClick={() => setView("colors")}
          />

          <MenuItem
            label={t('header_menu.language')}
            right={
              <>
                <span className="uppercase font-semibold text-xs">
                  {LANGUAGES.find(l => l.key === i18n.language)?.label || t('header_menu.language')}
                </span>
                <RightOutlined className="ml-2" />
              </>
            }
            onClick={() => setView("language")}
          />

          <MenuItem
            label={t('header_menu.color_mode')}
            right={
              <>
                <span className="uppercase font-semibold text-xs">{currentMode}</span>
                <RightOutlined className="ml-2" />
              </>
            }
            onClick={() => setView("mode")}
          />

          {isLogin && (
            <>
              <div className="divider-horizontal my-1 opacity-50" />
              <MenuItem 
                label={t('header_menu.logout')}
                onClick={handleLogout} 
              />
            </>
          )}
        </>
      )}

      {view === "language" && (<>
        <MenuHeader title={t('header_menu.language')} onBack={() => setView("main")} />
        <div className="max-h-[330px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
          {LANGUAGES.map((l) => (
            <MenuItem
              key={l.key}
              label={l.label}
              className={l.key === i18n.language ? "bg-hover" : ""} 
              isActive={l.key === i18n.language}
              onClick={() => i18n.changeLanguage(l.key)}
            />
          ))}
        </div>
      </>)}

      {view === "colors" && (
        <>
          <MenuHeader title={t('header_menu.colors')} onBack={() => setView("main")} />
          <div className="max-h-[330px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = primaryColor === c.key;
              return (
                <MenuItem
                  key={c.key}
                  label={t(c.label)}
                  icon={
                    <span
                      className={cn(
                        "block w-4 h-4 rounded-full border-2",
                        c.tailwindClass
                      )}
                      style={{ borderColor: lighten(THEME_COLORS[c.key], 0.4) }}
                    />
                  }
                  className={isSelected ? "bg-hover" : ""} 
                  isActive={isSelected}
                  onClick={() => setPrimaryColor(c.key)}
                />
              );
            })}
          </div>
        </>
      )}

      {view === "mode" && (
        <>
          <MenuHeader title={t('header_menu.color_mode')} onBack={() => setView("main")} />
          {MODES.map((m) => (
            <MenuItem
              key={m}
              label={m === 'Light' ? t('header_menu.light') : t('header_menu.dark')}
              isActive={theme === m.toLowerCase()}
              onClick={() => setTheme(m.toLowerCase() as 'light' | 'dark')}
            />
          ))}
        </>
      )}
    </div>
  );
}