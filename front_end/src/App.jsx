import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RoutesConfig from './routes/RoutesConfig'
import ToastNotifications from './components/toast-notification/CustomToast'

function App() {
  return (
    <div>
      <BrowserRouter>
        <ToastNotifications />
        {/* react routes configuration main jsx file */}
        <RoutesConfig />
      </BrowserRouter>
    </div>
  )
}

export default App
