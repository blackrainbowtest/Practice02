import commonStyle from "./style.module.css";
import commonEffect from "./effects.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function AddInput({ setIsClicked, inputData, defaultName="" }) {
  const [name, setName] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const buttonStyles = `
    ${commonStyle.inputButton}
    ${commonStyle.cursorPointer}
    `;

  const inputStyles = `
    ${commonStyle.inputStyle}
    ${commonEffect.inputShake}
    `;

  const createNewItemHandle = (e) => {
    e.stopPropagation();
    if (name.trim()) {
      inputData(name.trim());
      setIsClicked((prevIsClicked) => !prevIsClicked);
    } else {
      setIsShaking(true);
    }
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  useEffect(() => {
    if(defaultName.trim()) {
      setName(defaultName)
    }
  }, [defaultName])

  return (
    <div className={commonStyle.addNewItemContainer}>
      <label className={commonStyle.inputLabel}>Название:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`${inputStyles} ${isShaking ? commonEffect.active : ""}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            createNewItemHandle(e);
          }
        }}
      />
      <button onClick={createNewItemHandle} className={buttonStyles}>
        <FontAwesomeIcon icon={faFloppyDisk} />
      </button>
    </div>
  );
}
