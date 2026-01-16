import { BotDirectoryVariant } from '@app/enums/BotDirectory.enum';

export const GRID_PAGE_OPTIONS = [6, 12, 18, 24];
export const LIST_PAGE_OPTIONS = [5, 10, 15];

export const DEFAULT_GRID_SIZE = 6;
export const DEFAULT_LIST_SIZE = 5;

export const GRID_CLASSES: Record<BotDirectoryVariant, string> = {
    [BotDirectoryVariant.FULL]: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 gap-6 mt-4',
    [BotDirectoryVariant.COMPACT]: 'grid-cols-2 max-lg:grid-cols-3 max-2xl:grid-cols-3 gap-6 mt-4',
};

export const SORT_OPTIONS = [
    { value: "createdAt_DESC", labelKey: 'homepage.sort_options.created_newest' },
    { value: "createdAt_ASC", labelKey: 'homepage.sort_options.created_oldest' },
    { value: "name_ASC", labelKey: 'homepage.sort_options.name_az' },
    { value: "name_DESC", labelKey: 'homepage.sort_options.name_za' },
    { value: "updatedAt_DESC", labelKey: 'homepage.sort_options.updated_newest' },
    { value: "updatedAt_ASC", labelKey: 'homepage.sort_options.updated_oldest' },
];