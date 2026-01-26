import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Flex, Spin } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { cn } from '@app/utils/cn';
import Button from '@app/mtb-ui/Button';
import MtbTypography from '@app/mtb-ui/Typography/Typography';
import SingleSelect from '@app/mtb-ui/SingleSelect';
import BotGridItem from '@app/components/BotGridItem/BotGridItem';
import BotListItem from '@app/components/BotListItem/BotListItem';
import { IBotDirectoryProps } from './BotDirectory.types';
import { ViewMode } from '@app/enums/viewMode.enum';
import { PAGE_OPTIONS, GRID_CLASSES } from '@app/constants/BotDirectory.constant';
import { ItemVariant } from '@app/enums/ItemVariant.enum';

function BotDirectory({
    data,
    isLoading,
    currentPage,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions,
    sortOption,
    onSortChange,
    sortOptions,
    viewMode,
    onViewModeChange,
    variant = ItemVariant.FULL,
    gridItemVariant = ItemVariant.FULL,
    className,
    isPublic = true,
    showSort = true,
    showTitle = true,
    onRefresh,
}: IBotDirectoryProps) {
    const { t } = useTranslation(['home_page', 'components']);

    const finalPageSizeOptions = useMemo(() => {
        return pageSizeOptions || PAGE_OPTIONS;
    }, [pageSizeOptions]);

    const paginationSelectOptions = useMemo(() => {
        return finalPageSizeOptions.map((val) => ({
            value: val,
            label: t('homepage.bots_per_page', { count: val }),
        }));
    }, [finalPageSizeOptions, t]);

    const listContainerClass = useMemo(() => {
        if (viewMode === ViewMode.GRID) {
            return cn('grid', GRID_CLASSES[variant]);
        }
        return 'flex flex-col gap-4';
    }, [viewMode, variant]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className={cn('w-full flex flex-col', className)}>
            <Flex justify="space-between" wrap="wrap" align='center' className="gap-4 pt-8 pb-8">
                <div className='flex-shrink-0'>
                    {totalCount > 0 && (
                        <>
                            {showTitle && (
                                <MtbTypography variant='h3' customClassName="mb-1">
                                    {t('homepage.mezon_bots')}
                                </MtbTypography>
                            )}
                            <MtbTypography variant='h5' weight='normal'>
                                {t('homepage.showing_page', { current: currentPage, total: totalPages || 1 })}
                            </MtbTypography>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-end">
                    {showSort && sortOptions && sortOption && onSortChange && (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="text-secondary whitespace-nowrap hidden sm:inline-block">
                                    {t('homepage.sort_title')}:
                                </span>
                                <SingleSelect
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                    options={sortOptions}
                                    value={sortOption}
                                    onChange={onSortChange}
                                    size='large'
                                    placeholder={t('homepage.sort_placeholder')}
                                    className='min-w-[160px]'
                                    dropdownStyle={{ width: 'max-content' }}
                                    data-e2e="selectSortOptions"
                                />
                            </div>
                            <div className="hidden sm:block h-6 w-[1px] bg-border"></div>
                        </>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-secondary whitespace-nowrap hidden sm:inline-block">{t('homepage.pagination_title')}:</span>
                        <SingleSelect
                            getPopupContainer={(trigger) => trigger.parentElement}
                            onChange={onPageSizeChange}
                            options={paginationSelectOptions}
                            value={paginationSelectOptions.find(o => o.value === pageSize) || paginationSelectOptions[0]}
                            size='large'
                            className='w-[70px]'
                            data-e2e="selectPageOptions"
                        />
                    </div>

                    <div className="flex bg-container-secondary p-1 rounded-lg border border-border">
                        <Button
                            variant="text"
                            color="default"
                            icon={<BarsOutlined />}
                            onClick={() => onViewModeChange(ViewMode.LIST)}
                            className={cn(
                                "min-w-[40px] px-3",
                                viewMode === ViewMode.LIST
                                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                                    : '!text-secondary hover:!text-accent-primary'
                            )}
                            size="middle"
                        />
                        <Button
                            variant="text"
                            color="default"
                            icon={<AppstoreOutlined />}
                            onClick={() => onViewModeChange(ViewMode.GRID)}
                            className={cn(
                                "min-w-[40px] px-3",
                                viewMode === ViewMode.GRID
                                    ? '!bg-heading !text-primary !shadow-sm hover:!text-accent-primary'
                                    : '!text-secondary hover:!text-accent-primary'
                            )}
                            size="middle"
                        />
                    </div>
                </div>
            </Flex>

            {isLoading ? (  
                <div className='flex items-center justify-center h-64'>
                    <Spin size='large' />
                </div>
            ) : data.length > 0 ? (
                <div className={listContainerClass}>
                    {data.map((bot) => (
                        viewMode === ViewMode.GRID ? (
                            <BotGridItem key={bot.id} data={bot} isPublic={isPublic} onRefresh={onRefresh} variant={gridItemVariant}/>
                        ) : (
                            <BotListItem key={bot.id} readonly={true} data={bot} onRefresh={onRefresh} />
                        )
                    ))}
                </div>
            ) : (
                <MtbTypography variant='h4' weight='normal' customClassName='!text-center !block !text-secondary py-12'>
                    {t('homepage.no_result')}
                </MtbTypography>
            )}

            {totalCount > 0 && (
                <div className='flex flex-col items-center gap-5 pt-10'>
                    <div className='flex flex-col items-center relative w-full'>
                        <Pagination
                            onChange={onPageChange}
                            pageSize={pageSize}
                            showSizeChanger={false}
                            current={currentPage}
                            total={totalCount}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BotDirectory;