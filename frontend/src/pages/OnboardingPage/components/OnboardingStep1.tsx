import MtbTypography from '@app/mtb-ui/Typography/Typography';
import MtbButton from '@app/mtb-ui/Button';
import { RocketOutlined, TrophyOutlined, TeamOutlined, AimOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { FeatureCard } from '@app/components/FeatureCard/FeatureCard';

interface Props {
    onSkip: () => void;
    onNext: () => void;
}

function OnboardingStep1({ onSkip, onNext }: Props) {
    return (
        <div className='flex flex-col items-center py-10 px-6 w-full'>
                <RocketOutlined className='text-8xl !text-primary mb-4' />
                <MtbTypography variant='h1' customClassName='mt-4 text-text-primary'>
                Welcome to Mezon Top Board
            </MtbTypography>

                <MtbTypography variant='p' customClassName='text-text-secondary mt-2 max-w-3xl text-center !font-normal'>
                Mezon Top Board — #1 Bot Listing for Mezon.  
                Discover the best applications built on the Mezon ecosystem.  
                We curate and showcase top-tier apps leveraging Mezon’s cutting-edge technology, helping users and developers explore innovative solutions with ease.
            </MtbTypography>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full'>
                <FeatureCard icon={<TrophyOutlined />} title="Top Listings" color='orange'>
                    Explore the highest-rated and most innovative Mezon apps.
                </FeatureCard>
                <FeatureCard icon={<TeamOutlined />} title="For Users & Developers" color='red'>
                    Find tools, solutions, and inspirations across the ecosystem.
                </FeatureCard>
                <FeatureCard icon={<AimOutlined />} title="Discover Faster" color='indigo'>
                    Navigate curated app categories with ease.
                </FeatureCard>
                <FeatureCard icon={<ThunderboltOutlined />} title="Stay Updated" color='green'>
                    Follow trending apps and new breakthroughs in Mezon tech.
                </FeatureCard>
            </div>

            <MtbTypography variant='h1' customClassName='mt-20 text-primary'>
                Ready to get started?
            </MtbTypography>
            <MtbTypography variant='p' customClassName='mt-1 text-center !font-normal'>
                Let's set up your profile to personalize your experience.
            </MtbTypography>

            <div className='flex justify-center gap-4 mt-6'>
                <MtbButton color='default' variant='outlined' className='hover:text-primary p-5 text-sm' onClick={onSkip}>
                    Skip for now
                </MtbButton>
                <MtbButton color='primary' variant='solid' className='hover:bg-primary p-5 text-sm' onClick={onNext}>
                    Get Started
                </MtbButton>
            </div>
        </div>
    );
}

export default OnboardingStep1;