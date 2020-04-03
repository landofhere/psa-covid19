import test from 'ava'
import { fatalityRate, recoveryRate } from '../index'

test('fatalityRate', t => {
  t.is(fatalityRate({ Deaths: 100, Confirmed: 1000 }), 10)
})

test('recoveryRate', t => {
  t.is(recoveryRate({ Recovered: 200, Confirmed: 1000 }), 20)
})
