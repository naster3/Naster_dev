import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('mergea clases de tailwind conservando la ultima', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignora valores falsy y soporta objetos/arrays de clsx', () => {
    const optionalClass: string | undefined = undefined

    expect(cn('base', optionalClass, ['text-sm'], { 'font-bold': true, italic: false })).toBe(
      'base text-sm font-bold',
    )
  })
})
