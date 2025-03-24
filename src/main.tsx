
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling to diagnose white screen issues
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("Error rendering the app:", error);
    // Display a fallback UI when rendering fails
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>Please check the console for more information.</p>
      </div>
    `;
  }
}
