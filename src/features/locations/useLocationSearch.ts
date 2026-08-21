import { useAppDispatch } from '../../app/hooks'
import type { AutocompleteOption } from '../../types/search'
import { forecastRange } from '../forecast/dateRange'
import {
    setForecastArgs,
    setForecastPlace,
} from '../forecast/forecastSlice'
import {
    useLazyLookupPostcodeQuery,
    useSearchLocationsQuery,
    useSearchPostcodesQuery,
} from './locationsApi'

export const useLocationSearch = (query: string) => {
    const dispatch = useAppDispatch()

    const isPostcodeQuery = /^[a-z]{1,2}\d/i.test(query)

    const geocoding = useSearchLocationsQuery(query, {
        skip: query.length < 2 || isPostcodeQuery,
    })
    const postcodes = useSearchPostcodesQuery(query, {
        skip: query.length < 2 || !isPostcodeQuery,
    })
    const [lookupPostcode, lookup] = useLazyLookupPostcodeQuery()

    const { data, isFetching, isError } = isPostcodeQuery ? postcodes : geocoding

    const onSelect = (option: AutocompleteOption) => {
        if (option.id.startsWith('pc:')) {
            lookupPostcode(option.label).then(({ data: place }) => {
                if (!place) return

                dispatch(
                    setForecastArgs({
                        latitude: place.latitude,
                        longitude: place.longitude,
                        ...forecastRange(),
                    })
                )
                dispatch(
                    setForecastPlace({
                        name: place.postcode,
                        region: place.region,
                    })
                )
            })
            return
        }

        const place = geocoding.data?.find((result) => result.id === option.id)
        if (!place) return

        dispatch(
            setForecastArgs({
                latitude: place.latitude,
                longitude: place.longitude,
                ...forecastRange(),
            })
        )
        dispatch(
            setForecastPlace({
                name: place.label,
                region: place.description ?? '',
            })
        )
    }

    return {
        results: data ?? [],
        isFetching,
        isError:
            query.length >= 2 &&
            (isError || (isPostcodeQuery && lookup.isError)),
        onSelect,
    }
}