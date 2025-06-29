import type { User } from '@/types/User'

export const getName = (user: User) => {
  const names = (user.firstName + ' ' + user.lastName).trim()
  return names ? names.split(' ') : []
}

export const getFullName = (user: User) => {
  return (user.firstName + ' ' + user.lastName).trim()
}

export const getInitials = (user: User) => {
  const names = getName({ ...user })
  const firstName = names[0]?.[0] || ''
  const lastName = names.length > 1 ? names[names.length - 1]?.[0] || '' : ''
  return `${firstName}${lastName}`.toUpperCase()
}
