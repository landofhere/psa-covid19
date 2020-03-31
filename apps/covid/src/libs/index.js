export * from './stats'
export * from './geocode'
export * from './storage'

export const capitalize = s =>
  s
    .toLowerCase()
    .split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1))
    .join(' ')
