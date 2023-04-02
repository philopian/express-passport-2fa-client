export function now() {
  const now = new Date()

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentSecond = now.getSeconds()
  return `${currentHour}:${currentMinute}:${currentSecond}`
}
