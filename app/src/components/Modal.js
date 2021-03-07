import React, { useState, useEffect } from "react";

const Modal = ({
  children,
  buttonText,
  currentState = "closed",
  className = "",
  buttonClassName = "",
  title,
  theme = "default",
  showButton = true,
  open: openInitial,
  onClose = () => {},
}) => {
  const [open, setOpen] = useState(openInitial);

  useEffect(() => {
    setOpen(openInitial);
  }, [openInitial]);

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open]);

  const closeOnEsc = (e) => {
    if (e.which === 27) {
      setOpen(false);
    }
  };

  useEffect(() => {
    //setOpen(currentState === "open");
  }, [currentState]);

  useEffect(() => {
    window.addEventListener("keydown", closeOnEsc);

    return () => {
      window.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  return (
    <div className={`Modal__wrap ${className}`}>
      {showButton && (
        <button
          className={`Modal__button ${buttonClassName}`}
          onClick={(e) => {
            setOpen(!open);
          }}
        >
          {buttonText}
        </button>
      )}
      {open ? (
        <dialog className={`Modal Modal--${theme} `} open>
          <div className="Modal__inner">
            <header className="Modal__header">
              <button
                className="Modal__close"
                onClick={(e) => {
                  setOpen(false);
                }}
              >
                &times;
              </button>
              {title === undefined ? null : (
                <h2 className="Modal__title">{title}</h2>
              )}
            </header>
            {children}
          </div>
        </dialog>
      ) : null}
    </div>
  );
};

export default Modal;
