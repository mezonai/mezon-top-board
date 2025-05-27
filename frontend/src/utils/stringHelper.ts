export const safeConcatUrl = (baseUrl: string, path: string, params?: { [key: string]: any }) => {
  try {
    const url = new URL(baseUrl)
    url.pathname = `${url.pathname.replace(/\/$/, '')}/${encodeURIComponent(path).replace(/%2F/g, '/')}`

    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        const value = params[key]
        if (value !== undefined && value !== null) {
          url.searchParams.append(encodeURIComponent(key), encodeURIComponent(value))
        }
      })
    }

    return url.toString()
  } catch (error) {
    console.error('Invalid URL:', error)
    return baseUrl
  }
}

export const getQueryParams = (url: string) => {
  try {
    const queryString = url.split('?')[1]
    if (!queryString) {
      return {}
    }

    const queryParams: Record<string, string> = {}
    const pairs = queryString.split('&')

    pairs.forEach((pair: string) => {
      const [key, value] = pair.split('=')
      if (key) {
        queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '')
      }
    })

    return queryParams
  } catch (error) {
    console.error('Error parsing query parameters:', error)
    return {}
  }
}

export const handleMapOption = (enums: Record<string, string>) => {
  return Object.entries(enums).map(([key, value]) => ({
    label: key,
    value
  }))
}

export const getUrlMedia= (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${process.env.REACT_APP_BACKEND_URL}/api${path}`;
}

export function uuidToNumber(uuid: string) {
  // Remove all dashes from the UUID string.
  const cleanedUuid = uuid.replace(/-/g, '');
  let total = 0;
  // Sum the ASCII values of each character.
  for (let i = 0; i < cleanedUuid.length; i++) {
    total += cleanedUuid.charCodeAt(i);
  }
  return total;
}

export const fillHbsFormat = (str: string, data: Record<string, any>) => {
  return str.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim()
    return data[trimmedKey] !== undefined ? data[trimmedKey] : `{{${trimmedKey}}}`
  })
}

export const generateSlug = (name: string): string => {
  return name
    .normalize('NFD') // decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove special characters
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}
