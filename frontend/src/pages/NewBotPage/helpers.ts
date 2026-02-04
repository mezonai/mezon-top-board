import { AppStatus } from '@app/enums/AppStatus.enum'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { GetMezonAppDetailsResponse, TagInMezonAppDetailResponse, AppVersionDetailsDto } from '@app/services/api/mezonApp/mezonApp.types'
import { AppPricing } from '@app/enums/appPricing'
import { AppLanguage } from '@app/enums/appLanguage.enum'

const getDataSource = (detail: GetMezonAppDetailsResponse): AppVersionDetailsDto | GetMezonAppDetailsResponse => {
  const { versions, hasNewUpdate } = detail

  if (hasNewUpdate && versions && versions.length > 0) {
    return versions[0] 
  }

  if (versions && versions.length > 0) {
    const approvedVersions = versions.filter((v) => v.status === AppStatus.APPROVED)
    if (approvedVersions.length > 0) {
      return approvedVersions[0] 
    }
    return versions[0] 
  }

  return detail 
}

const mapDetailToFormData = (detail: GetMezonAppDetailsResponse): CreateMezonAppRequest => {
  const dataSource = getDataSource(detail)
  const changelog = dataSource.status === AppStatus.PENDING ? dataSource.changelog : '';
  const existingTranslations = detail.appTranslations || [];
  
  const formTranslations = [AppLanguage.EN, AppLanguage.VI].map(lang => {
    const found = existingTranslations.find(t => t.language === lang);
    return {
      id: found?.id,
      language: lang,
      name: found?.name || '',
      headline: found?.headline || '',
      description: found?.description || ''
    };
  });

  return {
    prefix: dataSource.prefix || '',
    featuredImage: dataSource.featuredImage || '',
    supportUrl: dataSource.supportUrl || '',
    pricingTag: dataSource.pricingTag || AppPricing.FREE,
    price: dataSource.price || 0,
    socialLinks: dataSource.socialLinks || [],
    changelog: changelog,
    // TODO: isAutoPublished will be implemented later
    isAutoPublished: true,
    tagIds: dataSource.tags?.map((tag: TagInMezonAppDetailResponse) => tag.id) || [],
    mezonAppId: detail.mezonAppId || '',
    type: detail.type,
    defaultLanguage: detail.defaultLanguage || AppLanguage.EN,
    appTranslations: formTranslations
  };
}

export {
  mapDetailToFormData
}