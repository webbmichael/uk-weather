import type { ComponentProps } from 'react'
import styles from './SearchInput.module.css'
import type { SearchChangeHandler } from '../../../types/search'

interface SearchInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: SearchChangeHandler
  label?: string
}

export const SearchInput = ({
  onChange = () => undefined,
  id = 'location-search',
  label = 'City or postcode',
  placeholder = 'City or postcode',
  ...rest
}: SearchInputProps) => {
  return (
    <div className={styles.wrapper} role="search">
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <input
        id={id}
        className={styles.input}
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange({ searchText: event.target.value })}
        {...rest}
      />
    </div>
  )
}
