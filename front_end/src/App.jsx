import React from 'react'
import AppRoutes from './routes/routes'
import ToastNotifications from './components/toast-notification/CustomToast'

function App() {
  return (
    <div>
      <ToastNotifications />
      <AppRoutes />
    </div>
  )
}

export default App
