import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enable MSW in development mode
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
