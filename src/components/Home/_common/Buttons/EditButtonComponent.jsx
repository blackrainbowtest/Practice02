import commonStyle from "../../../_common/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function EditButtonComponent({editMenuHandler}) {
  return (
    <div className={`${commonStyle.tooltipHover} ${commonStyle.relative}`}>
      <span className={commonStyle.tooltipText2}>Edit</span>
      <button type="button" onClick={editMenuHandler}>
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
    </div>
  );
}
