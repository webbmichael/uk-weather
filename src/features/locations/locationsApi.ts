import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LocationOption, PostcodeDetails, PostcodeOption } from '../../types/locations'
import {
    transformLocationSearch,
    transformPostcodeLookup,
    transformPostcodeSuggestions,
} from './transformLocations'

export const locationsApi = createApi({
    reducerPath: 'locationsApi',
    keepUnusedDataFor: 300, // 5 minutes (seconds)
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://geocoding-api.open-meteo.com/v1/',
    }),
    endpoints: (builder) => ({
        searchLocations: builder.query<LocationOption[], string>({
            query: (query) => {
                const trimmedQuery = query.trim()

                return {
                    url: 'search',
                    params: {
                        name: trimmedQuery,
                        count: 10,
                        language: 'en',
                        format: 'json',
                        countryCode: 'GB',
                    },
                }
            },
            transformResponse: transformLocationSearch,
        }),
        searchPostcodes: builder.query<PostcodeOption[], string>({
            query: (query) => ({
                url: `https://api.postcodes.io/postcodes/${encodeURIComponent(query.trim())}/autocomplete`,
                params: { limit: 8 },
            }),
            transformResponse: transformPostcodeSuggestions,
        }),
        lookupPostcode: builder.query<PostcodeDetails, string>({
            query: (postcode) => ({
                url: `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
            }),
            transformResponse: transformPostcodeLookup,
        }),
    }),
})

export const { useSearchLocationsQuery, useSearchPostcodesQuery, useLazyLookupPostcodeQuery } = locationsApi