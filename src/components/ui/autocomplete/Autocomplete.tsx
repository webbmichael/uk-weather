import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { SearchInput } from '../search-input/SearchInput'
import styles from './Autocomplete.module.css'
import type { AutocompleteOption } from '../../../types/search'

interface AutocompleteProps {
  id: string
  label: string
  placeholder?: string
  options: AutocompleteOption[]
  /** Rendered when the list is open and there is nothing to show. */
  noMatchMessage?: ReactNode
  isError: boolean
  onQueryChange: (query: string) => void
  onSelect: (option: AutocompleteOption) => void
}

export const Autocomplete = ({
  id,
  label,
  placeholder,
  options,
  noMatchMessage,
  isError,
  onQueryChange,
  onSelect,
}: AutocompleteProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [active, setActive] = useState(0)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isOpen = hasFocus && !isDismissed
  const hasOptions = options.length > 0

  const showNoMatch = isOpen && !hasOptions && !isError && Boolean(noMatchMessage)

  const select = (option: AutocompleteOption) => {
    setValue(option.label)
    setIsDismissed(true)
    onSelect(option)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return
    if (event.key === 'Escape') {
      setIsDismissed(true)
      return
    }
    if (!hasOptions) return

    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0

    if (step) {
      event.preventDefault()
      setActive((active + step + options.length) % options.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()

      const option = options[active]

      if (option) {
        select(option)
      }
    }
  }

  return (
    <div
      className={styles.autocomplete}
      onFocus={() => setHasFocus(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false)
      }}
    >
      <SearchInput
        ref={inputRef}
        id={id}
        label={label}
        placeholder={placeholder}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && hasOptions}
        aria-controls={isOpen && hasOptions ? `${id}-listbox` : undefined}
        aria-activedescendant={
          isOpen && hasOptions ? `${id}-option-${active}` : undefined
        }
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setValue(e.searchText)
          setIsDismissed(false)
          setActive(0)
          onQueryChange(e.searchText)
        }}
      />

      {isOpen && hasOptions && (
        <ul className={styles.results} id={`${id}-listbox`} aria-label={label} role="listbox">
          {options.map((option, index) => (
            <li
              key={option.id}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === active}
              className={styles.option}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                select(option)
                // Blur so input closes and keyboard collapses on mobile
                inputRef.current?.blur()
              }}
              onMouseEnter={() => setActive(index)}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionDescription}>{option.description}</span>
            </li>
          ))}
        </ul>
      )}

      {isError && (
        <p className={styles.error} role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      {showNoMatch && (
        <div className={styles.noMatch} role="status">
          {noMatchMessage}
        </div>
      )}
    </div>
  )
}
