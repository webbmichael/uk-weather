export type LocationOption = {
  id: string
  label: string
  latitude: number
  longitude: number
  description?: string
}

export type PostcodeOption = {
  id: string
  label: string
}

export type PostcodeDetails = {
  postcode: string
  latitude: number
  longitude: number
  region: string
}
