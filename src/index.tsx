import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('main')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
