
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const showPreviewError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #fdfcfb; color: #1e293b; font-family: Inter, system-ui, sans-serif;">
      <div style="max-width: 720px; border: 1px solid #e2e8f0; background: white; padding: 24px; border-radius: 12px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #dc2626;">Preview Error</p>
        <h1 style="margin: 0 0 12px; font-size: 24px;">The app failed to render</h1>
        <pre style="margin: 0; white-space: pre-wrap; font-size: 13px; line-height: 1.5;">${message.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)}</pre>
      </div>
    </div>
  `;
};

window.addEventListener('error', (event) => showPreviewError(event.error ?? event.message));
window.addEventListener('unhandledrejection', (event) => showPreviewError(event.reason));

const root = ReactDOM.createRoot(rootElement);
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  showPreviewError(error);
}
