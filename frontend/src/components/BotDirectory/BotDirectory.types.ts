import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types';
import { IOption } from '@app/mtb-ui/SingleSelect';
import { ViewMode } from '@app/enums/viewMode.enum';
import { ItemVariant } from '@app/enums/ItemVariant.enum';

export interface IBotDirectoryProps {
    data: GetMezonAppDetailsResponse[];
    isLoading?: boolean;
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (option: IOption) => void;
    pageSizeOptions?: number[];
    sortOption?: IOption;
    onSortChange?: (option: IOption) => void;
    sortOptions?: IOption[];
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    variant?: ItemVariant;
    gridItemVariant?: ItemVariant;
    className?: string;
    isPublic?: boolean;
    showSort?: boolean;
    showTitle?: boolean;
    onRefresh?: () => void;
}