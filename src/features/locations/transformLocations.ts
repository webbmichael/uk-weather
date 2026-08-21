import type { LocationOption, PostcodeDetails, PostcodeOption } from '../../types/locations'

export type LocationResult = {
    id: number
    name: string
    latitude: number
    longitude: number
    elevation: number
    feature_code: string
    country_code: string
    admin1?: string
    admin2?: string
    timezone: string
    population?: number
    country_id?: number
    country?: string
    admin1_id?: number
    admin2_id?: number
}

export type LocationSearchResponse = {
    results?: LocationResult[]
    generationtime_ms?: number
}

export type PostcodeAutocompleteResponse = {
    status: number
    result: string[] | null
}

export type PostcodeLookupResponse = {
    status: number
    result: {
        postcode: string
        latitude: number
        longitude: number
        admin_district: string | null
        country: string
    }
}

export const transformLocationSearch = (response: LocationSearchResponse): LocationOption[] =>
    response.results?.map((result) => ({
        id: 'geo:' + result.id,
        label: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        description: [result.admin2, result.admin1].filter(Boolean).join(', ')
    })) || []

export const transformPostcodeSuggestions = (response: PostcodeAutocompleteResponse): PostcodeOption[] =>
    (response.result || []).map((postcode) => ({
        id: 'pc:' + postcode,
        label: postcode,
    }))

export const transformPostcodeLookup = (response: PostcodeLookupResponse): PostcodeDetails => ({
    postcode: response.result.postcode,
    latitude: response.result.latitude,
    longitude: response.result.longitude,
    region: [response.result.admin_district, response.result.country].filter(Boolean).join(', '),
})
