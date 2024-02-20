import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./style.module.css";
import commonStyle from "../../_common/style.module.css";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addMenu, deleteMenu, dragMenu, patchMenu } from "../../../features/menu/menuAPI";
import { useEffect, useState } from "react";
import {
  changeCurrentItem,
  changeDraggedItem,
  updateData,
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
  const data = useSelector((state) => state?.menu?.data);
  const isChildShow = useSelector((state) => state?.menu?.isChildShow);

  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const itemSelectHandle = (e) => {
    // dispatch(changeCurrentItem(item));
  };

  useEffect(() => {
    setIsShow(isChildShow);
  }, [isChildShow]);

  // Menu Interaction Logic

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
    if (data.slice().filter((elm) => elm.parent === item.id).length) {
      alert("U cant delete this, at first delete childs");
    } else {
      dispatch(deleteMenu(item.id));
    }
  };

  const renameNewMenu = (callback) => {
    dispatch(patchMenu({ ...item, name: callback }));
  };

  // END Menu Interaction Logic

  // Logic for adding a new child element

  const addNewSubMenu = (callback) => {
    const order =
      data.slice().filter((elm) => elm.parent === item.id).length + 1;
    dispatch(addMenu({ name: callback, order, parent: item.id }));
  };

  // END Logic for adding a new child element

  // Drag and drop logic

  const dragStartHandle = (e) => {
    e.stopPropagation();
    dispatch(changeCurrentItem(item));
    setIsShow(false);
  };

  const dropHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    

    if (draggedItem && currentItem.id !== draggedItem?.id) {
      dispatch(dragMenu([
        data.find((obj) => obj.id === currentItem?.id),
        data.find((obj) => obj.id === draggedItem?.id)
      ]));
    }
  };

  const dragEndHandle = (e) => {
    e.stopPropagation();
    console.log("I worked");
    dispatch(changeDraggedItem(null));
    dispatch(changeCurrentItem(null));
  };

  const dragLeaveHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragOverHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDescendant(item.id, currentItem.id, data)) {
      if (draggedItem?.id !== item?.id) {
        // need to be update code and check in lambda func to change item parent to same one

        // Logic when current and dragged items in same parent directory
        if (currentItem.parent === item.parent) {
          const currentItemTemp = data.find((obj) => obj.id === currentItem.id);
          const draggedItemTemp = data.find((obj) => obj.id === item.id);
          console.log(currentItemTemp.order, draggedItemTemp.order);
          const newData = data.map((el) => {
            if (el.id === item.id) {
              return { ...el, order: currentItemTemp.order };
            } else if (el.id === currentItem.id) {
              return { ...el, order: draggedItemTemp.order };
            }
            return el;
          });
          dispatch(updateData(newData));
        } else {
          // Logic when current and dragged items isnt in same parent directory
        }
      }
      dispatch(changeDraggedItem(item));
    }
  };

  // END Drag and drop logic

  // UTIL

  const isDescendant = (parent, child, items) => {
    if (parent === child) {
      return true;
    }

    const parentItem = items.find((item) => item.id === parent);
    if (!parentItem || parentItem.parent === null) {
      return false;
    }

    return isDescendant(parentItem.parent, child, items);
  };

  return (
    <div
      className={`${styles.menuItemContainer} ${
        !isAdd && !isEdit ? styles.grab : null
      }`}
      draggable={!isAdd && !isEdit}
      onDragStart={dragStartHandle}
      onDragLeave={dragLeaveHandle}
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
        <div
          className={`${styles.subMenuCount} ${
            data.slice().filter((elm) => elm.parent === item.id).length
              ? commonStyle.cursorPointer
              : null
          }`}
          onClick={() => setIsShow((prev) => !prev)}
        >
          {data.slice().filter((elm) => elm.parent === item.id).length ? (
            <div className={styles.subMenuCountContainer}>
              <div
                className={`${styles.subMenuCountNumber} ${
                  currentItem?.id === item.id ? styles.active : null
                }`}
              >
                {data.slice().filter((elm) => elm.parent === item.id).length}
              </div>
              {isShow ? (
                <FontAwesomeIcon icon={faPlus} />
              ) : (
                <FontAwesomeIcon icon={faMinus} />
              )}
            </div>
          ) : null}
        </div>
        <div
          className={`
            ${styles.menuData} 
            ${commonStyle.relative} 
            ${currentItem?.id === item?.id ? styles.active : null}
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

      {isShow ? (
        data.slice().filter((elm) => elm.parent === item.id).length ? (
          <div
            className={styles.subMenu}
            onDragOver={(e) => e.stopPropagation()}
          >
            {data
              .slice()
              .filter((elm) => elm.parent === item.id)
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <MenuItemComponent key={item.id} item={item} />
              ))}
          </div>
        ) : null
      ) : null}
    </div>
  );
}
