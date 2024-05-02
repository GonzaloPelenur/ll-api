import React from "react";

const OverlayGIF = ({ gifPath, isVisible }) => {
  // CSS for the overlay
  const overlayStyle = {
    position: "fixed", // Overlay fixed over entire screen
    top: 0, // Start from top
    left: 0, // Start from left
    width: "100vw", // Full viewport width
    height: "100vh", // Full viewport height
    backgroundColor: "rgba(0, 128, 0, 0)", // Semi-transparent green background
    display: isVisible ? "flex" : "none", // Control display using isVisible
    justifyContent: "center", // Center gif horizontally
    alignItems: "center", // Center gif vertically
    zIndex: 1000, // Ensure it's above other content
  };

  return (
    <div style={overlayStyle}>
      <img
        src={gifPath}
        alt="Loading"
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
};

export default OverlayGIF;
