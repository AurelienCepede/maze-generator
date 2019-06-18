import React from "react";
import "./Case.css";

interface CaseProps {
    direction: string,
    width: string,
    height: string,
    title: string,
}

function Case(props: CaseProps) {
    const style: Object = {
        width: props.width,
        height: props.height,
    };
    return <div title={props.title} className={'Case' + props.direction} style={style}/>;
}

export default Case;