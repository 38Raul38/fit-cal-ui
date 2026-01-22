import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import './i18n'
import App from './App.tsx'

// Apply saved theme on app start
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Clean up old shared data keys once (migration)
// This removes data that was saved before per-user storage was implemented
const migrationKey = 'migration-to-per-user-storage-v1';
if (!localStorage.getItem(migrationKey)) {
  console.log('🔄 Migrating to per-user storage...');
  localStorage.removeItem('fit-tracker-meals');
  localStorage.removeItem('fit-tracker-favorites');
  localStorage.setItem(migrationKey, 'done');
  console.log('✅ Migration complete');
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
console.log('Google Client ID:', googleClientId);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </StrictMode>,

)
