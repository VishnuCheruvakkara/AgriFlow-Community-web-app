import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import for redux setup
import { Provider } from "react-redux";
//persistor setup
import { PersistGate } from 'redux-persist/integration/react';
//PersistGate ensures Redux loads stored state before rendering the app
import store, { persistor } from "./redux/Store.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)
