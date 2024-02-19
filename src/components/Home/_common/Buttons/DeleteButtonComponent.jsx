import commonStyle from "../../../_common/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function DeleteButtonComponent({ deleteMenuHandler }) {
  return (
    <div className={`${commonStyle.tooltipHover} ${commonStyle.relative}`}>
      <span className={commonStyle.tooltipText2}>Delete</span>
      <button type="button" onClick={deleteMenuHandler}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
