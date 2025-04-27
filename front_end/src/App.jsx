import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import ToastNotifications from "./components/toast-notification/CustomToast";
import LoaderSpinner from "./components/LoaderSpinner/LoaderSpinner";
import NoInternetPage from "./components/StatusPages/NoInternetPage";
import useStatusHandler from "./components/StatusPages/useStatusHandler";

function App() {
  const { isOnline } = useStatusHandler();

  if (!isOnline) {
    return <NoInternetPage />;
  }

  return (
    <div>
      <BrowserRouter>
        <ToastNotifications />
        <LoaderSpinner />

        {/* JUST this — let RoutesConfig handle all routing */}
        <RoutesConfig />
      </BrowserRouter>
    </div>
  );
}

export default App;
