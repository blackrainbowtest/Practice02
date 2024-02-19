import commonStyle from "../../../_common/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function AddButtonComponent({addSubMenuHandler}) {
  return (
    <div className={`${commonStyle.tooltipHover} ${commonStyle.relative}`}>
      <span className={commonStyle.tooltipText2}>Add</span>
      <button type="button" onClick={addSubMenuHandler}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </button>
    </div>
  );
}
