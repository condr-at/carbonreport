import assert from 'node:assert/strict'
import test from 'node:test'

import { AnswerMap } from './types'
import {
  UNKNOWN_ANSWER_CODE,
  hasMeaningfulAnswer,
  computeGroupVisibility,
} from './index'

test('hasMeaningfulAnswer treats UNKNOWN as empty', () => {
  assert.equal(hasMeaningfulAnswer(UNKNOWN_ANSWER_CODE), false)
  assert.equal(hasMeaningfulAnswer('EU'), true)
  assert.equal(hasMeaningfulAnswer([UNKNOWN_ANSWER_CODE]), false)
  assert.equal(hasMeaningfulAnswer(['CLIENT_EXISTING']), true)
})

test('computeGroupVisibility hides optional blocks until drivers present', () => {
  const baseAnswers: AnswerMap = {
    'Q0.1': null,
    'Q0.2': null,
    'Q0.3': null,
    'Q0.4': null,
    'Q0.5': null,
    'Q0.6': null,
    'Q1.1': ['UNKNOWN'],
  }

  const visibility = computeGroupVisibility(baseAnswers)
  assert.equal(visibility.regulator, false)
  assert.equal(visibility.client, false)
  assert.equal(visibility.operations, false)
  assert.equal(visibility.trade, false)
})

test('computeGroupVisibility enables regulator trade path for EU companies', () => {
  const answers: AnswerMap = {
    'Q0.1': 'EU',
    'Q0.2': null,
    'Q1.1': ['REGULATOR'],
  }

  const visibility = computeGroupVisibility(answers)
  assert.equal(visibility.regulator, true)
  assert.equal(visibility.operations, true)
  assert.equal(visibility.trade, true)
})

test('trade block stays hidden for non-priority regions unless trade answers exist', () => {
  const answers: AnswerMap = {
    'Q0.1': 'OTHER',
    'Q1.1': ['REGULATOR'],
    'Q9.1': null,
    'Q9.2': null,
    'Q9.3': null,
  }

  const noTradeVisibility = computeGroupVisibility(answers)
  assert.equal(noTradeVisibility.trade, false)

  const withTradeAnswers: AnswerMap = {
    ...answers,
    'Q9.1': 'YES',
  }

  const tradeVisible = computeGroupVisibility(withTradeAnswers)
  assert.equal(tradeVisible.trade, true)
})
