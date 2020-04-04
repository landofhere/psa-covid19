import { percentChange, percentChangeFromTotal } from '../stats'

describe('percent change', () => {
  test('should return increase percentage', () => {
    expect(percentChange(500, 5000)).toEqual(10)
  })

  test('should return 0 when change is 0', () => {
    expect(percentChange(0, 5000)).toEqual(0)
  })

  test('should return a number', () => {
    const change = percentChange(273, 5339)
    expect(change).toEqual(5.113317100580633)
    expect(typeof change).toBe('number')
  })
})

describe('percent change from total', () => {
  test('should return increase percentage', () => {
    expect(percentChangeFromTotal(5500, 5000)).toEqual(10)
  })

  test('should return 0 when change is 0', () => {
    expect(percentChangeFromTotal(5000, 5000)).toEqual(0)
  })

  test('should return a number', () => {
    const change = percentChangeFromTotal(5612, 5339)
    expect(change).toEqual(5.113317100580633)
    expect(typeof change).toBe('number')
  })
})
