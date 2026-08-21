export type SearchChangeHandler = (payload: { searchText: string }) => void

export interface AutocompleteOption {
  id: string
  label: string
  description?: string
}
