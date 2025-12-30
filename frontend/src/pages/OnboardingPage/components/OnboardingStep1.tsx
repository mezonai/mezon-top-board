import MtbTypography from '@app/mtb-ui/Typography/Typography';
import MtbButton from '@app/mtb-ui/Button';
import { useTranslation } from 'react-i18next';
import { RocketOutlined, TrophyOutlined, TeamOutlined, AimOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { FeatureCard } from '@app/components/FeatureCard/FeatureCard';

interface Props {
    onSkip: () => void;
    onNext: () => void;
}

function OnboardingStep1({ onSkip, onNext }: Props) {
    const { t } = useTranslation();
    return (
        <div className='flex flex-col items-center py-10 px-6 w-full'>
                <RocketOutlined className='text-8xl !text-heading mb-4' />
                <MtbTypography variant='h1' customClassName='mt-4 !text-heading'>
                {t('onboarding.step1.welcome_title')}
            </MtbTypography>

                <MtbTypography variant='p' customClassName='text-secondary mt-2 max-w-3xl text-center !font-normal'>
                {t('onboarding.step1.welcome_desc')}
            </MtbTypography>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full'>
                <FeatureCard icon={<TrophyOutlined />} title={t('onboarding.step1.cards.top_listings')} color='orange'>
                    {t('onboarding.step1.cards.top_listings_desc')}
                </FeatureCard>
                <FeatureCard icon={<TeamOutlined />} title={t('onboarding.step1.cards.for_users')} color='red'>
                    {t('onboarding.step1.cards.for_users_desc')}
                </FeatureCard>
                <FeatureCard icon={<AimOutlined />} title={t('onboarding.step1.cards.discover')} color='blue'>
                    {t('onboarding.step1.cards.discover_desc')}
                </FeatureCard>
                <FeatureCard icon={<ThunderboltOutlined />} title={t('onboarding.step1.cards.stay_updated')} color='green'>
                    {t('onboarding.step1.cards.stay_updated_desc')}
                </FeatureCard>
            </div>

            <MtbTypography variant='h1' customClassName='mt-20 text-primary'>
                {t('onboarding.step1.ready_title')}
            </MtbTypography>
            <MtbTypography variant='p' customClassName='mt-1 text-center !font-normal'>
                {t('onboarding.step1.ready_desc')}
            </MtbTypography>

            <div className='flex justify-center gap-4 mt-6'>
                <MtbButton color='default' variant='outlined' size='large' className='hover:text-primary p-5 text-sm' onClick={onSkip}>
                    {t('onboarding.step1.skip')}
                </MtbButton>
                <MtbButton color='primary' variant='solid' size='large' className='hover:bg-primary p-5 text-sm' onClick={onNext}>
                    {t('onboarding.step1.get_started')}
                </MtbButton>
            </div>
        </div>
    );
}

export default OnboardingStep1;