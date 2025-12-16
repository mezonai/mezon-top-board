import { useState } from "react";
import { RightOutlined, LeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from '@app/hook/useTheme'
import { useNavigate } from "react-router-dom";

const COLORS = [
  { key: "red", label: "Red", color: "bg-red-500" },
  { key: "pink", label: "Pink", color: "bg-pink-400" },
  { key: "purple", label: "Purple", color: "bg-purple-500" },
  { key: "blue", label: "Blue", color: "bg-blue-500" },
  { key: "green", label: "Green", color: "bg-green-500" },
  { key: "yellow", label: "Yellow", color: "bg-yellow-400" },
  { key: "orange", label: "Orange", color: "bg-orange-500" },
];

type Mode = 'Light' | 'Dark'
type Theme = 'light' | 'dark'

const mapThemeToMode = (theme: string): Mode => {
  switch (theme) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    default:
      return 'Light';
  }
};

export default function DropdownMenu({ isLogin, handleLogout }: { isLogin: boolean, handleLogout: () => void }) {
  const [view, setView] = useState<"main" | "colors" | "mode">("main");
  const [color, setColor] = useState("red");
  const { theme, setTheme } = useTheme()
  const mode = mapThemeToMode(theme);
  const navigate = useNavigate()

  const handleModeChange = (mode: Mode) => {
    setTheme(mode.toLowerCase() as Theme)
  }

  return (
    <div
      className="w-[228px] rounded-lg bg-bg-body shadow-xl border border-gray-300 p-2 text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {view === "main" && (
        <>
          {isLogin && (
            <div>

              <MenuItem
                label="Profile"
                onClick={() => { navigate(`/profile`) }}
              />
              <div className="h-[1px] my-2 bg-gray-300"></div>
            </div>
          )}

          <MenuItem
            label="Colors"
            right={
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full border-2 ${COLORS.find(c => c.key === color)?.color}`} />
                <span className="text-[14px]"><RightOutlined /></span>
              </div>
            }
            onClick={() => setView("colors")}
          />

          <MenuItem
            label="Color Mode"
            right={
              <div className="flex items-center gap-1">
                <span className="text-xs uppercase">{mode}</span>
                <RightOutlined />
              </div>
            }
            onClick={() => setView("mode")}
          />
          {isLogin && (
            <div>
              <div className="h-[1px] my-2 bg-gray-300"></div>
              <MenuItem
                label="Log out"
                onClick={handleLogout}
              />
            </div>
          )}

        </>
      )}

      {view === "mode" && (
        <>
          <Header title="Color Mode" onBack={() => setView("main")} />
          {(['Light', 'Dark'] as Mode[]).map((m) => (
            <SelectItem
              key={m}
              label={m}
              active={mode === m}
              onClick={() => handleModeChange(m)}
            />
          ))}
        </>
      )}

      {view === "colors" && (
        <>
          <Header title="Colors" onBack={() => setView("main")} />
          {COLORS.map(c => (
            <div
              key={c.key}
              onClick={() => setColor(c.key)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-bg-hover ${color === c.key ? c.color : ""
                }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border-2 ${c.color}`} />
                <span>{c.label}</span>
              </div>
              {color === c.key && <span className="text-[10px]"><CheckOutlined /></span>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function MenuItem({ label, right, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex w-full items-center justify-between p-3 rounded-md cursor-pointer hover:bg-bg-hover"
    >
      <span>{label}</span>
      {right}
    </div>
  );
}

function Header({ title, onBack }: any) {
  return (
    <div className="flex-col">
      <div className="flex items-center gap-2 border-gray-300 p-3 hover:bg-bg-hover rounded-md mb-2" onClick={onBack}>
        <LeftOutlined className="cursor-pointer" />
        <span className="font-medium">{title}</span>
      </div>
      <div className="h-[1px] my-2 bg-gray-300"></div>
    </div>
  );
}

function SelectItem({ label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-bg-hover`}
    >
      <span>{label}</span>
      {active && <span className="text-[10px]"><CheckOutlined /></span>}
    </div>
  );
}
