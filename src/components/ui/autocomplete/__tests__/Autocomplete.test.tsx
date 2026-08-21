// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Autocomplete } from '../Autocomplete'
import type { AutocompleteOption } from '../../../../types/search'

const options: AutocompleteOption[] = [
  { id: 'geo:1', label: 'Brighton', description: 'Brighton and Hove, England' },
  { id: 'geo:2', label: 'Bristol', description: 'Bristol, England' },
]

const renderAutocomplete = (props: Partial<Parameters<typeof Autocomplete>[0]> = {}) => {
  const onQueryChange = vi.fn()
  const onSelect = vi.fn()

  render(
    <Autocomplete
      id="location-search"
      label="Search for a city or postcode"
      options={options}
      isError={false}
      onQueryChange={onQueryChange}
      onSelect={onSelect}
      {...props}
    />,
  )

  return { onQueryChange, onSelect, input: screen.getByRole('combobox') }
}

describe('Autocomplete', () => {
  it('keeps the error visible after blur', async () => {
    const user = userEvent.setup()
    const { input } = renderAutocomplete({ options: [], isError: true })

    await user.click(input)

    expect(screen.getByRole('alert').textContent).toContain(
      'Something went wrong. Please try again.',
    )

    await user.tab()

    expect(screen.getByRole('alert')).toBeTruthy()
  })

  it('does not show no results when there is an error', async () => {
    const user = userEvent.setup()

    renderAutocomplete({
      options: [],
      noMatchMessage: 'No place matched “Bristol”.',
      isError: true,
    })

    await user.click(screen.getByRole('combobox'))

    expect(screen.queryByText(/No place matched/)).toBeNull()
  })

  it('blurs the input when an option is clicked', async () => {
    const user = userEvent.setup()
    const { input } = renderAutocomplete()

    await user.type(input, 'Br')
    await user.click(screen.getByRole('option', { name: /Bristol/ }))

    expect(document.activeElement).not.toBe(input)
  })

  it('keeps focus when an option is selected with Enter', async () => {
    const user = userEvent.setup()
    const { onSelect, input } = renderAutocomplete()

    await user.type(input, 'Br')
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalled()
    expect(document.activeElement).toBe(input)
  })
})
