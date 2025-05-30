export enum ErrorMessages {
    NOT_FOUND_MSG = 'Cannot find this record',
    INVALID_TAGS = 'Invalid tags',
    INVALID_LINK_TYPE = 'Invalid link type',
    EXISTED_LINK_TYPE = 'This link type is already existed ',
    TOKEN_EXPIRED = 'Your session has expired. Please log in again to continue.',
    INVALID_EMAIL = 'Invalid email',
    INVALID_PASSWORD = 'Invalid password',
    INVALID_USER = 'Cannot find this user',
    INVALID_APP = 'Cannot find this app',
    MODIFY_REVIEW_RESTRICTION = 'Only the review owner is permitted to update or delete it.',
    PERMISSION_DENIED = 'You do not have permission.',
    APP_RATING_LIMIT_REACHED = 'You have already rated this app.',
    APP_RATING_EDIT_RESTRICTION = 'You can only edit your rating',
    EXISTED_TAG = 'This tag is already existed '
}

export enum SuccessMessages {
    UPDATE_SUCCESS = 'Update successfully',
    DELETE_SUCCESS = 'Delete successfully',
}