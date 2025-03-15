import React from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners"; // Importing from react-spinners

const LoaderSpinner = () => {
  const { fullPageLoading } = useSelector((state) => state.loader);

  if (!fullPageLoading) return null; // Don't render if not loading

  return (
    <div style={styles.overlay}>
      <ClipLoader size={80} color="white" />
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Faded screen effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
};

export default LoaderSpinner;
