export function makeid(length: number) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}
