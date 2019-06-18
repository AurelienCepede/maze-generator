import React from "react";
import "./Case.css";

interface CaseProps {
    direction: string,
    width: number,
    height: number,
}

function Case({direction, width, height} : CaseProps) {
    const style: Object = {
        width: width + "px",
        height: height + "px",
    };
    return <div className={'Case' + direction} style={style}/>;
}

export default Case;