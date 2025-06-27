export const formatDateToBrazilian = (dateString: string): string => {
  if (dateString.includes('-') && dateString.length === 10) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${day}/${month}/${year}`
  }

  return dateString
}

export const formatDateToAmerican = (dateString: string): string => {
  if (dateString.includes('/')) {
    return dateString
  }

  if (dateString.includes('-') && dateString.length === 10) {
    const [year, month, day] = dateString.split('-')
    return `${month}/${day}/${year}`
  }

  if (dateString.length === 8) {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return `${month}/${day}/${year}`
  }

  return dateString
}

export const formatDateToISO = (dateString: string): string => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = dateString.match(dateRegex)

  if (!match) {
    return dateString
  }

  const [, month, day, year] = match
  return `${year}-${month}-${day}`
}

export const applyDateMask = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')

  let formattedValue = numericValue
  if (numericValue.length >= 2) {
    formattedValue = numericValue.slice(0, 2) + '/' + numericValue.slice(2)
  }
  if (numericValue.length >= 4) {
    formattedValue =
      numericValue.slice(0, 2) +
      '/' +
      numericValue.slice(2, 4) +
      '/' +
      numericValue.slice(4, 8)
  }

  return formattedValue
}
