# UK Weather Forecast

Search for a UK location and see the current conditions plus a multi-day
forecast.

**Live demo: https://uk-weather-seven.vercel.app/**

## Getting started

Requires Node `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

Runs on http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run the tests |
| `npm run test:watch` | Run the tests in watch mode |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and apply fixes |

## Key decisions

* I chose to build an autocomplete rather than a basic location search. The input is debounced by 300ms to limit unnecessary requests, with keyboard navigation, empty states and error feedback included.
* The autocomplete supports both cities and UK postcodes. Normal searches use Open-Meteo, while postcode-like input switches to Postcodes.io and retrieves coordinates when a result is selected.
* I used RTK Query for fetching, caching and deduplicating location and forecast requests, while keeping selected location/date state in Redux.
* Forecast data is fetched in a single five-day request and transformed into a simpler structure, so changing days does not require another request.
* API responses are transformed before reaching the UI, keeping presentation components independent of the external API structure.
* Weather descriptions and icons are derived from the WMO weather codes defined in Open-Meteo's documentation: https://open-meteo.com/en/docs#weather_variable_documentation

## Trade-offs

* RTK Query adds more setup than is strictly needed for a single-page app, but provides a clearer structure if the application grows.
* Supporting postcode autocomplete requires a second API and an additional lookup request after selection.
* Postcode detection uses a simple prefix regex so partial postcodes such as `N1` work, at the cost of some edge cases being classified incorrectly.
* Some future-day metrics, such as humidity and visibility, use representative hourly values rather than full-day summaries.

## Improvements

Given more time, I would:

* Add an hourly forecast and make more use of the data available from Open-Meteo.
* Include precipitation probability, wind direction, UV index and sunrise/sunset times.
* Use URL parameters for the selected location and date so forecasts persist across refreshes and can be bookmarked or shared.
* Improve postcode handling for unusual or malformed inputs.


