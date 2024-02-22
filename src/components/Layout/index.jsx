import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { changeIsChildShow } from "../../features/menu/menuSlice";
import commonStyle from "../_common/style.module.css";
import styles from "./style.module.css";

export default function Layout() {
  const [isChildShow, setIsChildShow] = useState(false);
  const dispatch = useDispatch();
  const changeShown = (e) => {
    dispatch(changeIsChildShow(!isChildShow));
    setIsChildShow(prev => !prev);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid gray",
        }}
      >
        layout
        <div className={styles.showButton} onClick={changeShown}>
          {isChildShow ? (
            <FontAwesomeIcon
              icon={faEye}
              className={commonStyle.cursorPointer}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              className={commonStyle.cursorPointer}
            />
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
