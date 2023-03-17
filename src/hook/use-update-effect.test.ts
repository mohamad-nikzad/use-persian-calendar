import { describe, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import useUpdateEffect from './use-update-effect'

describe('use update effect()', () => {
  test('the callback function should have been called on update', () => {
    const effect = vi.fn()
    let deps = 'ali'
    const { rerender, result } = renderHook(() => useUpdateEffect(effect, [deps]))

    expect(effect).not.toHaveBeenCalled()
    deps = 'mammad'
    rerender(true)
    expect(effect).toHaveBeenCalledTimes(1)
  })
})
