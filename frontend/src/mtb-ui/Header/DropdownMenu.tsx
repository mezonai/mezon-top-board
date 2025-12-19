import { useState } from "react";
import { RightOutlined, LeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from '@app/hook/useTheme'
import { useNavigate } from "react-router-dom";
import { cn } from "@app/utils/cn";

const COLORS = [
  { key: "red", label: "Red", color: "bg-red-500" },
  { key: "pink", label: "Pink", color: "bg-pink-400" },
  { key: "purple", label: "Purple", color: "bg-purple-500" },
  { key: "blue", label: "Blue", color: "bg-blue-500" },
  { key: "green", label: "Green", color: "bg-green-500" },
  { key: "yellow", label: "Yellow", color: "bg-yellow-400" },
  { key: "orange", label: "Orange", color: "bg-orange-500" },
];

type ViewState = "main" | "colors" | "mode";
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
      !className && "hover:bg-bg-hover",
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
      className="flex items-center gap-2 p-2 mb-1 cursor-pointer hover:bg-bg-hover rounded-md transition-base" 
      onClick={onBack}
    >
      <LeftOutlined className="text-xs" />
      <span className="text-heading-5 !text-sm !font-semibold">{title}</span>
    </div>
    <div className="divider-horizontal my-1 opacity-50"></div>
  </>
);

export default function DropdownMenu({ isLogin, handleLogout }: { isLogin: boolean, handleLogout: () => void }) {
  const [view, setView] = useState<ViewState>("main")
  const [color, setColor] = useState("red")
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const currentMode = theme === 'dark' ? 'Dark' : 'Light';
  const activeColorClass = COLORS.find(c => c.key === color)?.color;

  return (
    <div 
      className="card-elevated bg-bg-container w-[240px] p-2 flex flex-col gap-1 rounded-lg shadow-lg border border-border"
      onClick={(e) => e.stopPropagation()}
    >
      {view === "main" && (
        <>
          {isLogin && (
            <>
              <MenuItem 
                label="Profile" 
                onClick={() => { navigate(`/profile`) }} 
              />
              <div className="divider-horizontal my-1 opacity-50" />
            </>
          )}

          <MenuItem
            label="Colors"
            right={
              <>
                <span className={`w-4 h-4 rounded-full border-2 border-black ${activeColorClass}`} />
                <RightOutlined className="ml-2" />
              </>
            }
            onClick={() => setView("colors")}
          />

          <MenuItem
            label="Color Mode"
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
                label="Log out" 
                onClick={handleLogout} 
              />
            </>
          )}
        </>
      )}

      {view === "colors" && (
        <>
          <MenuHeader title="Colors" onBack={() => setView("main")} />
          <div className="max-h-[330px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {COLORS.map((c) => {
              const isSelected = color === c.key;
              return (
                <MenuItem
                  key={c.key}
                  label={c.label}
                  icon={
                    <span 
                      className={cn(
                        "block w-4 h-4 rounded-full border-2 border-black", 
                        c.color 
                      )} 
                    />
                  }
                  className={isSelected ? c.color : ""} 
                  isActive={isSelected}
                  onClick={() => setColor(c.key)}
                />
              );
            })}
          </div>
        </>
      )}

      {view === "mode" && (
        <>
          <MenuHeader title="Color Mode" onBack={() => setView("main")} />
          {MODES.map((m) => (
            <MenuItem
              key={m}
              label={m}
              isActive={currentMode === m}
              onClick={() => setTheme(m.toLowerCase() as 'light' | 'dark')}
            />
          ))}
        </>
      )}
    </div>
  );
}