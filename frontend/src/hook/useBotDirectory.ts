import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewMode } from '@app/enums/viewMode.enum';
import { IOption } from '@app/mtb-ui/SingleSelect';
import { SORT_OPTIONS, PAGE_OPTIONS } from '@app/constants/BotDirectory.constant';

interface UseBotDirectoryProps {
    initialViewMode?: ViewMode;
    initialPage?: number;
}

export const useBotDirectory = ({ initialViewMode = ViewMode.GRID, initialPage = 1 }: UseBotDirectoryProps = {}) => {
    const { t } = useTranslation(['home_page']);
    const sortOptions = useMemo(() => {
        return SORT_OPTIONS.map((opt) => ({
            value: opt.value,
            label: t(opt.labelKey)
        }));
    }, [t]);

    const [page, setPage] = useState<number>(initialPage);
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [pageSize, setPageSize] = useState<number>(PAGE_OPTIONS[0]);
    const [sortField, setSortField] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

    const selectedSort = useMemo(() => {
        const currentVal = `${sortField}_${sortOrder}`;
        return sortOptions.find(opt => opt.value === currentVal) || sortOptions[0];
    }, [sortField, sortOrder, sortOptions]);

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (option: IOption) => {
        setPageSize(Number(option.value));
        setPage(1);
    };

    const handleSortChange = (option: IOption) => {
        if (typeof option.value === 'string') {
            const [field, order] = option.value.split("_");
            setSortField(field);
            setSortOrder(order as "ASC" | "DESC");
            setPage(1);
        }
    };

    return {
        page,
        setPage,
        pageSize,
        viewMode,
        handleViewModeChange,
        handlePageChange,
        handlePageSizeChange,
        sortField,
        sortOrder,
        selectedSort,
        sortOptions,
        handleSortChange,
    };
};