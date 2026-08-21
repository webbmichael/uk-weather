import { useState } from 'react'
import styles from './WeatherSearch.module.css'
import { Autocomplete } from './ui/autocomplete/Autocomplete'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocationSearch } from '../features/locations/useLocationSearch'


export const WeatherSearch = () => {
    const [input, setInput] = useState('')
    const query = useDebouncedValue(input.trim(), 300)

    const { results, isFetching, isError, onSelect } = useLocationSearch(query)
    const isSettled = !isFetching && input.trim() === query && query.length >= 2

    return (
        <section className={styles.panel}>
            <div className={styles.head}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>Weather</h1>
                </div>

                <Autocomplete
                    id="location-search"
                    label="Search for a city or postcode"
                    placeholder="City or postcode…"
                    options={results}
                    noMatchMessage={
                        isSettled &&
                        `No place matched “${query}”. Try a different spelling or a nearby town.`
                    }
                    isError={isError}
                    onQueryChange={setInput}
                    onSelect={onSelect}
                />
            </div>
        </section>
    )
}