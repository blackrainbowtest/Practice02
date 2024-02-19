import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./style.module.css";
import commonStyle from "../../_common/style.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteMenu, patchMenu } from "../../../features/menu/menuAPI";
import { useState } from "react";
import {
  changeCurrentItem,
  changeDraggedItem,
} from "../../../features/menu/menuSlice";
import MenuItemAddSubMenuComponent from "./MenuItemAddSubMenuComponent";
import DeleteButtonComponent from "./Buttons/DeleteButtonComponent";
import AddButtonComponent from "./Buttons/AddButtonComponent";
import EditButtonComponent from "./Buttons/EditButtonComponent";
import MenuEditMenuComponent from "./MenuEditMenuComponent";
import MenuItemName from "./MenuItemName";

export default function MenuItemComponent({ item }) {
  const dispatch = useDispatch();
  const currentItem = useSelector((state) => state?.menu?.currentItem);
  const draggedItem = useSelector((state) => state?.menu?.draggedItem);

  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const itemSelectHandle = (e) => {
    dispatch(changeCurrentItem(item));
  };

  const editMenuHandler = (e) => {
    e.stopPropagation();
    setIsEdit((prev) => !prev);
    dispatch(changeCurrentItem(item));
  };

  const addSubMenuHandler = (e) => {
    e.stopPropagation();
    setIsAdd((perv) => !perv);
  };

  const deleteMenuHandler = (e) => {
    e.stopPropagation();
    dispatch(deleteMenu(item.id));
  };

  const renameNewMenu = (callback) => {
    dispatch(patchMenu({ ...item, name: callback }));
  };

  const addNewSubMenu = (callback) => {
    console.log(callback);
  };

  // Drag logic

  const dragStartHandle = (e) => {
    dispatch(changeCurrentItem(item));
  };

  async function dropHandle(e) {
    e.preventDefault();

    if (currentItem.order !== draggedItem.order) {
      await dispatch(patchMenu({ ...currentItem, order: draggedItem.order }));
      await dispatch(patchMenu({ ...draggedItem, order: currentItem.order }));
      dispatch(changeDraggedItem(null));
    }
  }

  const dragEndHandle = (e) => {
    dispatch(changeDraggedItem(null));
  };

  const dragOverHandle = (e) => {
    e.preventDefault();
    dispatch(changeDraggedItem(item));
  };

  return (
    <div
      className={`${styles.menuItemContainer} ${!isAdd && !isEdit ? styles.grab : null}`}
      draggable={!isAdd && !isEdit}
      onDragStart={dragStartHandle}
      onDragLeave={dragEndHandle}
      onDragEnd={dragEndHandle}
      onDragOver={dragOverHandle}
      onDrop={dropHandle}
    >
      <div
        className={`
          ${styles.menuItem} 
          ${
            currentItem?.id === item?.id
              ? styles.active
              : draggedItem?.id === item.id
              ? styles.secondary
              : null
          }
      `}
        onClick={itemSelectHandle}
      >
        <div className={styles.subMenuCount}>
          {!item.data.length ? (
            <div className={styles.subMenuCountContainer}>
              <div className={styles.subMenuCountNumber}>
                {item.data.length}
              </div>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          ) : null}
        </div>
        <div
          className={`
            ${styles.menuData} 
            ${commonStyle.relative} 
            ${
              currentItem?.id === item?.id
                ? styles.active
                : draggedItem?.id === item.id
                ? styles.secondary
                : null
            }
          `}
        >
          {isEdit ? (
            <MenuEditMenuComponent
              setIsEdit={setIsEdit}
              editMenu={renameNewMenu}
              name={item.name}
            />
          ) : (
            <MenuItemName name={item.name} />
          )}
        </div>
        <div className={styles.menuAction}>
          <EditButtonComponent editMenuHandler={editMenuHandler} />
          <AddButtonComponent addSubMenuHandler={addSubMenuHandler} />
          <DeleteButtonComponent deleteMenuHandler={deleteMenuHandler} />
        </div>
      </div>

      {isAdd ? (
        <MenuItemAddSubMenuComponent
          setIsAdd={setIsAdd}
          addNewSubMenu={addNewSubMenu}
        />
      ) : null}
    </div>
  );
}
