import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { ApiKeyProvider } from './context/ApiKeyContext'
import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <DataProvider>
          <AuthProvider>
            <ApiKeyProvider>
              <App />
            </ApiKeyProvider>
          </AuthProvider>
        </DataProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)
