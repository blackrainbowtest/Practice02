import styles from "./styles.module.css";
import commonStyle from "../../_common/style.module.css";

export default function AddNewMenuButtonComponent({ isClicked, setIsClicked }) {
  const buttonClickHandle = () => {
    setIsClicked((prevIsClicked) => !prevIsClicked);
  };

  const divClassName = `
    ${styles.addNewMenuItem}
    ${commonStyle.flexCenter}
    ${commonStyle.cursorPointer}
    ${commonStyle.relative}
    ${commonStyle.tooltipHover}
  `;

  const buttonClassName = `
    ${styles.addNewMenuButton}
    ${commonStyle.cursorPointer}
    ${commonStyle.noSelect}
  `;

  return (
    <div onClick={buttonClickHandle} className={divClassName}>
      <button type="button" className={buttonClassName}>{isClicked ? '\u2796' : '✚'}
        <span className={commonStyle.tooltipText}>Add New Menu</span>
      </button>
    </div>
  );
}
