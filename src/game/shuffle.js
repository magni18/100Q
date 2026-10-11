export function shuffle(items, random = Math.random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const itemAtIndex = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = itemAtIndex;
  }
  return shuffled;
}
