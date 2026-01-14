import { SetMetadata } from '@nestjs/common';
import { MetaKey } from '@libs/constant/meta-key.constant';

export const OptionalAuth = () => SetMetadata(MetaKey.OPTIONAL_AUTH, true);