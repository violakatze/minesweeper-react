import { act, renderHook } from '@testing-library/react'
import { useMinesweeper } from '../hooks'
import { Cell } from '../types'
import * as gen from '../utils'

// できあがる盤面
// 222110
// **3*31
// 223*4*
// 0012*3
// 00012*
const numbers: number[] = [6, 7, 9, 15, 17, 22, 29]
const neighborBombCountList: number[] = [
  2, 2, 2, 1, 1, 0, 1, 1, 3, 1, 3, 1, 2, 2, 3, 2, 4, 1, 0, 0, 1, 2, 3, 3, 0, 0, 0, 1, 2, 1
]

const expectedRow: number = 5
const expectedColumn: number = 6
const expectedRangeMax: number = expectedRow * expectedColumn
const expectedBombCount: number = 7
const expectedRows = [...Array(expectedRow)].map((_, i) => i)
const expectedColumns = [...Array(expectedColumn)].map((_, i) => i)

const expectedCells: Cell[] = [...Array(expectedRangeMax)].map(
  (_, i): Cell => ({
    index: i,
    isBomb: numbers.some(n => n === i),
    neighborBombCount: neighborBombCountList[i],
    isOpen: false
  })
)

// クリア手順
const clearProcedure: number[] = [0, 1, 2, 3, 4, 5, 8, 12, 13, 14, 16, 18, 23, 28]

describe('useMinesweeperテスト', () => {
  beforeAll(() => {
    const spy = vi.spyOn(gen, 'getRandomNumbers')
    spy.mockReturnValue(numbers)
  })

  test('初期化', () => {
    const {
      result: {
        current: { rows, columns, bombCount, remainings, status, cells }
      }
    } = renderHook(() => useMinesweeper())

    expect(rows).toMatchObject(expectedRows)
    expect(columns).toMatchObject(expectedColumns)
    expect(bombCount).toBe(expectedBombCount)
    expect(remainings).toBe(expectedRangeMax - expectedBombCount)
    expect(status).toBe('playing')
    expect(cells).toMatchObject(expectedCells)
  })

  test('セルオープン(1)', () => {
    const { result } = renderHook(() => useMinesweeper()) // 入れ子分割代入すると値の変化を拾えない

    act(() => result.current.onOpen(0))

    const expectedOpens = [0]
    const cells = expectedCells.map((c, i): Cell => {
      if (expectedOpens.some(o => o === i)) {
        return { ...c, isOpen: true }
      }
      return c
    })

    expect(result.current.cells).toMatchObject(cells)
  })

  test('セルオープン(2)', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => result.current.onOpen(16))

    const expectedOpens = [16]
    const cells = expectedCells.map((c, i): Cell => {
      if (expectedOpens.some(o => o === i)) {
        return { ...c, isOpen: true }
      }
      return c
    })

    expect(result.current.cells).toMatchObject(cells)
  })

  test('再帰オープン', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => result.current.onOpen(24))

    const expectedOpens = [12, 13, 14, 18, 19, 20, 21, 24, 25, 26, 27] // 24の周囲が再帰的にオープンされる
    const cells = expectedCells.map((c, i): Cell => {
      if (expectedOpens.some(o => o === i)) {
        return { ...c, isOpen: true }
      }
      return c
    })

    expect(result.current.cells).toMatchObject(cells)
  })

  test('ゲームクリア', () => {
    const { result } = renderHook(() => useMinesweeper())

    // クリア手順を実行
    clearProcedure.forEach(p => {
      act(() => result.current.onOpen(p))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.cells.map(c => c.isOpen).every(c => c === true)).toBeTruthy() // 全部開いた状態
  })

  test('ゲームオーバー', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => result.current.onOpen(6))

    expect(result.current.status).toBe('failure')
    expect(result.current.cells.map(c => c.isOpen).every(c => c === true)).toBeTruthy() // 全部開いた状態
  })

  test('残セル(1)', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => result.current.onOpen(0))

    // 期待結果 = 全セル数 - 爆弾数 - 開いたセル数
    expect(result.current.remainings).toBe(expectedRangeMax - expectedBombCount - 1)
  })

  test('残セル数(2)', () => {
    const { result } = renderHook(() => useMinesweeper())

    act(() => result.current.onOpen(24))

    const expectedOpens = [12, 13, 14, 18, 19, 20, 21, 24, 25, 26, 27] // 24の周囲が再帰的にオープンされる

    // 期待結果 = 全セル数 - 爆弾数 - 開いたセル数
    expect(result.current.remainings).toBe(
      expectedRangeMax - expectedBombCount - expectedOpens.length
    )
  })

  test('再スタート(1)', () => {
    const { result } = renderHook(() => useMinesweeper())

    // クリア手順を実行
    clearProcedure.forEach(p => {
      act(() => result.current.onOpen(p))
    })

    // 再スタート
    act(() => result.current.restart())

    expect(result.current.status).toBe('playing')
    expect(result.current.cells).toMatchObject(expectedCells)
  })

  test('再スタート(2)', () => {
    const { result } = renderHook(() => useMinesweeper())

    // ゲームオーバー
    act(() => result.current.onOpen(6))

    // 再スタート
    act(() => result.current.restart())

    expect(result.current.status).toBe('playing')
    expect(result.current.cells).toMatchObject(expectedCells)
  })
})
