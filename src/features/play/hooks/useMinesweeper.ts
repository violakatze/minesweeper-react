import { useEffect, useState } from 'react'
import { Cell, StatusType } from '../types'
import { getRandomNumbers } from '../utils'

/**
 * minesweeper本体
 */
export const useMinesweeper = () => {
  const row: number = 5
  const column: number = 6
  const rangeMax = row * column
  const bombCount: number = 7
  const [status, setStatus] = useState<StatusType>('playing')
  const [remainings, setRemainings] = useState<number>(0)
  const rows = [...Array(row)].map((_, i) => i)
  const columns = [...Array(column)].map((_, i) => i)

  useEffect(() => {
    if (status === 'failure' || status === 'success') {
      // ゲームオーバーorクリア時に全部開く(通常のオープンとは分離しておく)
      setCells(
        cells.map(({ index, isBomb, neighborBombCount }) => ({
          index,
          isBomb,
          neighborBombCount,
          isOpen: true
        }))
      )
      return
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  /**
   * 左側index取得
   * @param current 現在位置
   * @returns
   */
  const getLeft = (current: number | undefined): number | undefined => {
    if (current !== undefined) {
      // 左端以外なら現在位置-1を返す
      const value = current - 1
      if (value >= 0 && column !== 0 && current % column !== 0) {
        return value
      }
    }

    return undefined
  }

  /**
   * 右側index取得
   * @param current 現在位置
   * @returns
   */
  const getRight = (current: number | undefined): number | undefined => {
    if (current !== undefined) {
      // 右端以外なら現在位置+1を返す
      const value = current + 1
      if (value <= rangeMax && column !== 0 && value % column !== 0) {
        return value
      }
    }

    return undefined
  }

  /**
   * 上側index取得
   * @param current 現在位置
   * @returns
   */
  const getUpper = (current: number | undefined): number | undefined => {
    if (current !== undefined) {
      // 上端以外なら現在位置-columnを返す
      const value = current - column
      if (value >= 0) {
        return value
      }
    }

    return undefined
  }

  /**
   * 下側index取得
   * @param current 現在位置
   * @returns
   */
  const getLower = (current: number | undefined): number | undefined => {
    if (current !== undefined) {
      // 下端以外なら現在位置+columnを返す
      const value = current + column
      if (value < rangeMax) {
        return value
      }
    }

    return undefined
  }

  /**
   * 隣接8か所のindexを取得
   * @param current 現在位置
   * @returns
   */
  const getNeighborIndexes = (current: number): number[] => {
    const left = getLeft(current)
    const right = getRight(current)
    const neighbors: (number | undefined)[] = [
      getUpper(left),
      getUpper(current),
      getUpper(right),
      left,
      right,
      getLower(left),
      getLower(current),
      getLower(right)
    ]

    // undefinedを除外して返す
    return neighbors.filter(n => n !== undefined)
  }

  /**
   * 隣接セルの爆弾数取得
   * @param bombPositions 爆弾indexの配列
   * @param current 現在位置
   * @returns
   */
  const getNeighborBombCount = (bombPositions: number[], current: number): number => {
    const neighbors = getNeighborIndexes(current)
    const count = bombPositions.filter(b => neighbors.some(n => n === b)).length
    return count
  }

  /**
   * 初期セル生成
   * @returns
   */
  const createCells = (): Cell[] => {
    const nums = getRandomNumbers(bombCount, rangeMax)
    return [...Array(rangeMax)].map(
      (_, i): Cell => ({
        index: i,
        isBomb: nums.some(n => n === i),
        neighborBombCount: getNeighborBombCount(nums, i),
        isOpen: false
      })
    )
  }

  /**
   * セル
   */
  const [cells, setCells] = useState<Cell[]>(createCells())

  useEffect(() => {
    if(cells === undefined) {
      return
    }

    setRemainings(cells.filter(r => !r.isOpen && !r.isBomb).length)
  },[cells])

  /**
   * セルオープン施行後のセル取得
   * @param activeCells 現時点のcell状態
   * @param index 開くセルのindex
   * @returns
   */
  const getResults = (activeCells: Cell[], index: number): Cell[] => {
    // すでにopenになってるindex収集
    const openedIndexes = activeCells.filter(c => c.isOpen).map(c => c.index)

    // 再帰openメソッド
    const recursiveOpen = (current: number) => {
      if (!openedIndexes.some(i => i === current)) {
        openedIndexes.push(current)
      } else {
        return
      }

      const cell = activeCells.find(c => c.index === current)
      if (cell === undefined) {
        throw new Error('index不正')
      }

      if (!cell.isBomb && cell.neighborBombCount === 0) {
        // 隣接爆弾数が0ならば周囲8方向のオープンを試行
        const neihborIndexes = getNeighborIndexes(current)
        neihborIndexes.forEach(i => recursiveOpen(i))
      }

      return
    }

    // 再帰的にopen
    recursiveOpen(index)

    // open状態を反映したセルを返す
    const resultCells = activeCells.map(
      ({ index, isBomb, neighborBombCount }): Cell => ({
        index,
        isBomb,
        neighborBombCount,
        isOpen: openedIndexes.some(i => i === index)
      })
    )
    return resultCells
  }

  /**
   * セルオープン
   * @param index 開くセルのindex
   */
  const onOpen = (index: number) => {
    if (status !== 'playing') {
      return
    }

    const currentCell = cells.find(c => c.index === index)
    if (currentCell === undefined) {
      throw new Error('index不正')
    }

    if (currentCell.isOpen) {
      return
    }

    const results = getResults(cells, index)
    setCells(results)

    if (currentCell.isBomb) {
      setStatus('failure')
    } else if (results.filter(r => !r.isOpen && !r.isBomb).length === 0) {
      setStatus('success')
    }
  }

  /**
   * 再スタート
   */
  const restart = () => {
    setCells(createCells())
    setStatus('playing')
  }

  return {
    rows,
    columns,
    bombCount,
    remainings,
    status,
    cells,
    onOpen,
    restart
  }
}
