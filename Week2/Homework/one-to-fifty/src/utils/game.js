function shuffleNumbers(numbers) {
  const shuffled = [...numbers]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export function createTiles(maxNumber) {
  const half = maxNumber / 2
  const firstNumbers = Array.from({ length: half }, (_, index) => index + 1)
  const secondNumbers = Array.from(
    { length: half },
    (_, index) => index + half + 1,
  )
  const visibleNumbers = shuffleNumbers(firstNumbers)
  const hiddenNumbers = shuffleNumbers(secondNumbers)

  return visibleNumbers.map((current, index) => ({
    current,
    next: hiddenNumbers[index],
  }))
}
