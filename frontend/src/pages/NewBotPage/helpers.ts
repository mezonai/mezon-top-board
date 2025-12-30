import { AppStatus } from '@app/enums/AppStatus.enum'
import { CreateMezonAppRequest } from '@app/services/api/mezonApp/mezonApp.types'
import { GetMezonAppDetailsResponse, TagInMezonAppDetailResponse, AppVersionDetailsDto } from '@app/services/api/mezonApp/mezonApp.types'
import { AppPricing } from '@app/enums/appPricing'

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
  const remark = 'remark' in dataSource ? dataSource.remark : ''

  return {
    name: dataSource.name || '',
    headline: dataSource.headline || '',
    description: dataSource.description || '',
    prefix: dataSource.prefix || '',
    featuredImage: dataSource.featuredImage || '',
    supportUrl: dataSource.supportUrl || '',
    pricingTag: dataSource.pricingTag || AppPricing.FREE,
    price: dataSource.price || 0,
    socialLinks: dataSource.socialLinks || [],
    remark: remark,
    // TODO: isAutoPublished will be implemented later
    isAutoPublished: true,
    tagIds: dataSource.tags?.map((tag: TagInMezonAppDetailResponse) => tag.id) || [],
    mezonAppId: detail.mezonAppId || '',
    type: detail.type
  }
}

export {
  mapDetailToFormData
}