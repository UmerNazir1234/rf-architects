export const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const randomDelay = (min: number = 300, max: number = 600) => {
  const randomMs = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(randomMs)
}
