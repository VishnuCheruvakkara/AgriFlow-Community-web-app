import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import ToastNotifications from "./components/toast-notification/CustomToast";
import LoaderSpinner from "./components/LoaderSpinner/LoaderSpinner";
import NoInternetPage from "./components/StatusPages/NoInternetPage";
import useStatusHandler from "./components/StatusPages/useStatusHandler";
import useGlobalRipple from "./components/CustomRipple/useGlobalRipple";
import RealTimeNotificationToast from "./components/toast-notification/RealTimeNotificationToast";

function App() {
  useGlobalRipple();
  const { isOnline } = useStatusHandler();

  if (!isOnline) {
    return <NoInternetPage />;
  }

  return (
    <div>
      <BrowserRouter>
        <ToastNotifications />
        <RealTimeNotificationToast/>
        <LoaderSpinner />

        {/* JUST this — let RoutesConfig handle all routing */}
        <RoutesConfig />
      </BrowserRouter>
    </div>
  );
}

export default App;
