// components/Fireworks.js
import React, { useState } from "react";
import "../styles/Fireworks.css";

const Fireworks = ({ show }) => {
  return (
    <>
      {show && (
        <div className="fireworks">
          {Array.from({ length: 100 }).map((_, index) => (
            <div
              key={index}
              className="firework"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(${Math.random() * 255}, ${
                  Math.random() * 255
                }, ${Math.random() * 255}, 1)`,
              }}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};

export default Fireworks;
