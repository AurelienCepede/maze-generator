import React from "react";
import "./Personnage.css";

interface PersonnageProps {
  width: number,
  height: number,
  x: number,
  y: number,
}

function Personnage({width, height, x, y}:PersonnageProps) {

    return <div className="Personnage"  style={{
      position: "absolute",
      width: width * 0.6 + "px",
      height: height * 0.6 + "px",
      left:  x + width * 0.2 + "px",
      top:  y + height * 0.2 + "px",
        borderRadius: "100%",
    }} />;
}

export default Personnage;