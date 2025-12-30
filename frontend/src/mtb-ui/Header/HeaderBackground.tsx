import { cn } from '@app/utils/cn';

type HeaderBackgroundProps = {
  isScrolled: boolean;
};

const HeaderBackground = ({ isScrolled }: HeaderBackgroundProps) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden transition-all duration-500">
      <div 
        className={cn(
          "absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )} 
      />
      
      <div className={cn("absolute inset-0 transition-opacity duration-500", isScrolled ? "opacity-0" : "opacity-100")}>
        <div className="absolute inset-0 bg-accent-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent" />
        <div 
            className="absolute inset-0 backdrop-blur-[1px]" 
            style={{ 
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 25%)' 
            }} 
        />
        <div 
            className="absolute inset-0 backdrop-blur-[2px]" 
            style={{ 
                maskImage: 'linear-gradient(to bottom, black 25%, transparent 50%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 50%)' 
            }}
        />
        <div 
            className="absolute inset-0 backdrop-blur-[4px]" 
            style={{ 
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 75%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 75%)' 
            }}
        />
        <div 
            className="absolute inset-0 backdrop-blur-[8px]" 
            style={{ 
                maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)' 
            }} 
        />
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-500",
        isScrolled 
          ? "bg-border/50 shadow-[0_1px_10px_rgba(0,0,0,0.1)]" 
          : "bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" 
      )} />
    </div>
  )
}

export default HeaderBackground;