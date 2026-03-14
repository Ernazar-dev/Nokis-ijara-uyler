import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // <--- MÍNA QATAR BOLIWI SHÁRT
import { AuthProvider } from './context/AuthContext.jsx'
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>,
)