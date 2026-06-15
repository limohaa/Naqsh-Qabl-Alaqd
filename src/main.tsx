import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { useSession } from './app/store';
import './styles/global.css';

// Review gate: DRAFT questions are only included when `?review=1` is present.
const params = new URLSearchParams(window.location.search);
const reviewMode = params.get('review') === '1';

const store = useSession.getState();
store.setReviewMode(reviewMode);
// Restore a saved session only if the user previously opted into persistence.
store.restore();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
