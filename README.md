# Form Mapping Prefill UI

This project is a coding challenge implementation for Avantos. It builds a UI that allows users to map fields between a Directed Acyclic Graph (DAG) of reusable forms, allowing downstream forms to be prefilled using upstream form data or global fields.

---

## Features

- Fetches DAG of form nodes and edges from a mock backend
- Allows users to map target fields to source fields via an intuitive sidebar UI
- Supports global fields and parent/ancestor form sources
- Mappings are persisted using `localStorage` (simulating a real backend)
- Mapping changes can be saved to a mock API endpoint (simulated with MSW)
- Fully modular and extensible to support new data sources in the future
- Unit tests using **Vitest** with **Jest matchers**

---

## Tech Stack

- **React** (with Vite)
- **TypeScript**
- **Vitest** for testing
- **MSW** (Mock Service Worker) for API mocking
- **localStorage** for simulating persisted state

---

## Getting Started

### 1. Clone This Repo

```bash
git clone https://github.com/your-username/form-mapping-challenge.git
cd form-mapping-challenge
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Start the Mock Server (Required)

Clone and run the official [frontend challenge server](https://github.com/mosaic-avantos/frontendchallengeserver):

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm run start
```

This mock server exposes the `action-blueprint-graph-get` endpoint needed to retrieve the DAG of forms.

---

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

---

## Running Tests

This project uses **Vitest** with **Jest matchers** for expressive tests.

```bash
npm run test
```

Tests are located under `src/utils/__tests__/` and `src/components/__tests__/`.

---

## MSW (Mock Service Worker)

Used to simulate `GET` and `POST` requests for mapping persistence via `localStorage`.

- Defined in: `src/mocks/handlers.ts`
- Bootstrapped in: `src/mocks/browser.ts`
- Started from: `main.tsx`

### API Endpoints Simulated

| Method | Endpoint                                     | Purpose                       |
|--------|----------------------------------------------|-------------------------------|
| GET    | `/api/v1/mock/actions/blueprints/test/graph` | Loads the DAG                 |
| GET    | `/api/v1/global-fields`                      | Loads global fields           |
| GET    | `/api/v1/mappings`                           | Load saved mappings           |
| POST   | `/api/v1/mappings`                           | Save mappings to localStorage |

---

## Environment Variables

```env
# .env.local
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

Set this environment variable to point to the mock server.

---

## Architecture Notes

- `FormNode` = container for a form (static DAG structure)
- `RawForm` = actual form schema, reusable across nodes
- Mappings are saved per **node**, not per form (since multiple nodes can reuse a form)
- Mapping strings are rendered as:
  ```
  {Target Field Title}: {Source Form Label}.{Source Field Name}
  ```

---

## Design for Microservice Integration

Although the backend isn’t implemented here, this app is structured to simulate backend communication and persistence. Once the backend is ready:

- Replace the MSW mocks with real endpoints
- Remove localStorage logic (optional)
- The frontend will support:
  - Multi-user collaboration
  - Persistent, server-side mappings
  - Server-provided DAGs and form metadata

---

## Project Structure

```
src/
│
├── api/               # API calls (DAG, mappings, global fields)
├── components/        # UI components (FormView, MappingPanel, etc.)
├── hooks/             # Custom hooks (e.g., useAccordionSources)
├── mocks/             # MSW handlers
├── utils/             # Utility functions (e.g., resolveMappingText)
└── test/              # Setup tests and includes factory for mock data
```

---

## TODO / Possible Improvements

- Add integration tests using MSW
- Add drag-and-drop node UI for DAG (out of scope for now)
- Store last selected form in localStorage
- Animate MappingModal transitions

---

## Challenge Submission

This project was completed for the Avantos Frontend Coding Challenge.

- A DAG of forms is fetched and visualized
- Fields can be mapped between global data and ancestor forms
- Mappings persist across reloads (via localStorage)
- Mappings can be saved to a (mocked) server

---

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE – see the LICENSE file
