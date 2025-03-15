import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RoutesConfig from './routes/RoutesConfig'
import ToastNotifications from './components/toast-notification/CustomToast'
import LoaderSpinner from './components/LoaderSpinner/LoaderSpinner'
function App() {
  return (
    <div>
      <BrowserRouter>
        {/* for common toast notification */}
        <ToastNotifications />
        {/* for common page loading spinner setup */}
        <LoaderSpinner/>
        {/* react routes configuration main jsx file */}
        <RoutesConfig />
      </BrowserRouter>
    </div>
  )
}

export default App
