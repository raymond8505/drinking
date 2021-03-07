import React from "react";

const FieldSet = ({
  legend = "", //the text to put in the legend tag
  children,
  className = "",
}) => {
  return (
    <fieldset className={`FieldSet${className !== "" ? " " + className : ""}`}>
      {legend === "" ? null : <legend>{legend}</legend>}
      {children}
    </fieldset>
  );
};

export default FieldSet;
