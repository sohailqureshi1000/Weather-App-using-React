# Weather App

A simple React weather application where users can search for any city and view its current temperature and wind speed, using the free Open-Meteo API (no API key required).

## How to Run

npm install
npm run dev

## How AI Assisted

- I had never used React before this assignment. AI explained the core concepts (components, JSX, props, state, useEffect) with simple examples before any code was written.
- AI generated the initial project scaffolding steps (Vite + React setup) and guided me through running it in the terminal and opening it in VS Code.
- AI wrote the first version of App.jsx (input field + state to track the typed city name) so I could see state updates working live.
- AI wrote the API integration logic (fetching city coordinates via Open-Meteo's geocoding API, then fetching weather data for those coordinates) and explained each fetch step.
- AI wrote the CSS styling for a clean, dark-themed, centered layout.
- AI suggested and implemented UX improvements: a loading state on the Search button, disabling it while loading, and allowing search via the Enter key.

## Manual Improvements / Review

- Verified each piece of AI-generated code by testing it in the browser after every change (input state, API calls, styling, UX changes) before moving to the next step.
- Tested edge cases manually: searching with an empty input, searching an invalid/misspelled city name, and confirming the error messages displayed correctly.
- Reviewed the wrapping of the input and button inside a `search-box` div to make sure the CSS classes applied correctly, since this required a small structural change to the JSX AI had originally provided.
- Chose to keep the API calls in the same handleSearch function rather than splitting into separate functions, for simplicity given the scope of this assignment.