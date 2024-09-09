/**
 * 盤面状態
 */
export type StatusType = 'playing' | 'failure' | 'success'

/**
 * セル
 */
export type Cell = {
  index: number
  isBomb: boolean
  neighborBombCount: number
  isOpen: boolean
}
