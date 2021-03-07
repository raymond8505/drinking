import React, { useState } from "react";

const EyeButton = ({onClick,open = true}) => {

    //initOpen = initOpen === undefined ? true : initOpen;

    const [isOpen,setOpen] = useState(open);

    const handleClick = e => {

        setOpen(!isOpen);

        onClick(!isOpen);
    }

    return (<button className="EyeButton" onClick={handleClick}>
        <i class={`fa fa-${isOpen ? 'eye' : 'eye-slash'}`}></i>
    </button>);
}

export default EyeButton;