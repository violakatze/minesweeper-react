/**
 * 乱数配列生成(数値重複無し)
 * @param count bomb数
 * @param rangeMax 表サイズ(row * column9
 * @returns
 */
export const getRandomNumbers = (count: number, rangeMax: number): number[] => {
  if (count < 0) {
    throw new Error('countが0未満')
  }

  if (rangeMax < 1) {
    throw new Error('rangeMaxが1未満')
  }

  if (count > rangeMax) {
    throw new Error('count > rangeMax')
  }

  if (count === 0) {
    return []
  }

  if (count === rangeMax) {
    return [...Array(rangeMax)].map((_, i) => i)
  }

  const results: number[] = []
  while (results.length < count) {
    // 0 <= x < rangeMaxの重複しない乱数を生成
    const rnd = Math.floor(Math.random() * rangeMax)
    if (!results.some(r => r == rnd)) {
      results.push(rnd)
    }
  }

  // 昇順ソート
  return results.sort((a, b) => a - b)
}
