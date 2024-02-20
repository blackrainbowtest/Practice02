import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { changeIsChildShow } from "../../features/menu/menuSlice";
import commonStyle from "../_common/style.module.css"

export default function Layout() {
  const [isChildShow, setIsChildShow] = useState(false);
  const dispatch = useDispatch();
  const changeShownOn = (e) => {
    setIsChildShow(true);
    dispatch(changeIsChildShow(true));
  };
  const changeShownOff = (e) => {
    setIsChildShow(false);
    dispatch(changeIsChildShow(false));
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid gray"}}>
        layout
        {isChildShow ? (
          <FontAwesomeIcon icon={faEye} onClick={changeShownOff} className={commonStyle.cursorPointer} />
        ) : (
          <FontAwesomeIcon icon={faEyeSlash} onClick={changeShownOn} className={commonStyle.cursorPointer} />
        )}
      </div>
      <Outlet />
    </div>
  );
}
