import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dice5, Loader2 } from 'lucide-react';
import { useLazyMezonAppControllerGetRandomAppQuery } from '@app/services/api/mezonApp/mezonApp';
import { toast } from 'react-toastify';
import MtbButton from '@app/mtb-ui/Button';
import styles from './LuckyButton.module.scss';
import { cn } from '@app/utils/cn';

const LuckyButton = () => {
  const navigate = useNavigate();
  const [trigger, { isFetching }] = useLazyMezonAppControllerGetRandomAppQuery();
  const [isHovered, setIsHovered] = useState(false);

  const handleLuckyClick = async () => {
    try {
      const result = await trigger().unwrap();
      if (result.data?.id) {
        navigate(`/bot/${result.data.id}`);
      } else {
        toast.info("No apps available right now!");
      }
    } catch (error) {
      toast.error("Failed to get lucky app");
    }
  };

  return (
      <div 
        className={cn("fixed bottom-10 right-10 z-50 flex items-center gap-2", styles.animateFloat)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={cn(`
            bg-container rounded-2xl shadow-md
            transition-all duration-300 ease-out overflow-hidden 
            whitespace-nowrap flex items-center
            ${isHovered ? 'w-auto opacity-100 mr-2 py-2 px-4 scale-100' : 'w-0 opacity-0 p-0 scale-95'}
          `)}
        >
          <span className="font-semibold text-sm">
            I'm feeling lucky today! ✨
          </span>
        </div>

        <MtbButton 
          variant="primary" 
          onClick={handleLuckyClick}
          disabled={isFetching}
          className={cn(`
            !rounded-full !w-14 !h-14 flex items-center justify-center !p-0
            shadow-lg
            transition-all duration-300 transform hover:scale-110 active:scale-95
          `)}
        >
          {isFetching ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Dice5 className={`w-7 h-7 ${isHovered ? 'animate-pulse' : ''}`} />
          )}
        </MtbButton>
      </div>
  );
};

export default LuckyButton;