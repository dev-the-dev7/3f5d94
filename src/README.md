# Avantos Form Mapping Challenge

This project is a solution to the Avantos Frontend Coding Challenge. It provides a UI for configuring prefill mappings between fields in a directed acyclic graph (DAG) of forms. The mappings define how values from fields in upstream forms (or global fields) can be used to prefill fields in downstream forms.

## Features

- Load forms, edges, and global fields from a mock API
- View and edit prefill mappings using a sidebar modal
- Support for mapping from ancestor and global fields
- Clear existing mappings
- Save mappings to local storage or mock backend
- Simulate persistence with MSW (Mock Service Worker)
- Unit tests for components and utilities
- Extensible design for future data sources

## Technologies

- React + TypeScript
- Vite
- MSW (Mock Service Worker)
- vitest and Jest for testing
- LocalStorage + mock backend API
- CSS modules for scoped styling

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/avantos-mapping-ui.git
cd avantos-mapping-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

This will launch the app on [http://localhost:5173](http://localhost:5173).

### 4. Run tests

```bash
npm run test
```

## Backend Mock Server

This project depends on a mock API server to simulate forms, edges, and global fields.

## Setup Instructions

### 1. Clone the challenge server repo:

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Start the mock server:

```bash
npm run start
```

The app will now pull form graph data from the server at startup.


## Environment Variables

Create a `.env.local` file in the root:

```bash
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

This controls the base URL for API requests. MSW will intercept these calls in development.

## Project Structure

```
src/
├── api/                 # API request logic
├── components/          # React UI components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── mocks/               # MSW handlers and browser worker
├── types/               # TypeScript interfaces
├── test/                # Unit test setup and factory
└── App.tsx              # Main application component
```

## Development Tips

- Field mapping logic is abstracted into `MappingPill.tsx` and `MappingPanel.tsx`
- Prefill sources are managed by the `useAccordionSources` hook
- Use `resolveMappingText()` to convert a mapping into user-friendly display text
- The `saveMappings()` and `fetchMappings()` functions simulate a backend integration

## Design Goals

- Clean component structure and state management
- Easy to extend with new field sources or mapping logic
- Separation of concerns between UI, data fetching, and business logic
- Developer-friendly: clear naming, typings, and test coverage

## License

This project is provided as part of a coding challenge and is not licensed for production use.
