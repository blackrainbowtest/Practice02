import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./style.module.css";
import commonStyle from "../../_common/style.module.css";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addMenu,
  deleteMenu,
  dragMenu,
  patchMenu,
} from "../../../features/menu/menuAPI";
import { useEffect, useState } from "react";
import {
  changeCurrentItem,
  changeDraggedItem,
  updateData,
  updateModifiedData,
} from "../../../features/menu/menuSlice";
import MenuItemAddSubMenuComponent from "./MenuItemAddSubMenuComponent";
import DeleteButtonComponent from "./Buttons/DeleteButtonComponent";
import AddButtonComponent from "./Buttons/AddButtonComponent";
import EditButtonComponent from "./Buttons/EditButtonComponent";
import MenuEditMenuComponent from "./MenuEditMenuComponent";
import MenuItemName from "./MenuItemName";
import {
  bottomHalfLogicHandler,
  isDescendant,
  topHalfLogicHandler,
} from "../../../utils/dragAndDrop";

export default function MenuItemComponent({ item }) {
  const dispatch = useDispatch();
  const currentItem = useSelector((state) => state?.menu?.currentItem);
  const draggedItem = useSelector((state) => state?.menu?.draggedItem);
  const data = useSelector((state) => state?.menu?.data);
  const isChildShow = useSelector((state) => state?.menu?.isChildShow);
  const modifiedData = useSelector((state) => state?.menu?.modifiedData);

  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isHalf, setIsHalf] = useState(null);

  const itemSelectHandle = (e) => {
    dispatch(changeCurrentItem(item));
    setIsShow(prev => !prev)
  };

  useEffect(() => {
    setIsShow(isChildShow);
  }, [isChildShow]);

  // Menu Interaction Logic

  const editMenuHandler = (e) => {
    e.stopPropagation();
    setIsEdit((prev) => !prev);
    dispatch(changeCurrentItem(item));

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsEdit(false);
        document.removeEventListener('keydown', handleEscKey);
      }
    };
    document.addEventListener('keydown', handleEscKey);
  };

  const addSubMenuHandler = (e) => {
    e.stopPropagation();
    setIsAdd((perv) => !perv);
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsAdd(false);
        document.removeEventListener('keydown', handleEscKey);
      }
    };
    document.addEventListener('keydown', handleEscKey);
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

  // Add New Sub Menu Logic

  const addNewSubMenu = (callback) => {
    const order =
      data.slice().filter((elm) => elm.parent === item.id).length + 1;
    dispatch(addMenu({ name: callback, order, parent: item.id }));
  };

  // Drag and drop logic

  const dragStartHandle = (e) => {
    e.stopPropagation();
    dispatch(changeCurrentItem(item));
    setIsShow(false);
  };

  const dropHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (modifiedData.length) {
      const updateData = data.filter(obj => modifiedData.includes(obj.parent));
      dispatch(dragMenu(updateData));
    }
    dispatch(changeDraggedItem(null));
  };

  const dragEndHandle = (e) => {
    e.stopPropagation();
    dispatch(changeDraggedItem(null));
    dispatch(changeCurrentItem(null));
  };

  const dragLeaveHandle = (e) => {
    e.stopPropagation();
  };

  const dragOverHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDescendant(item.id, currentItem.id, data)) {
      const elementRect =
        e.currentTarget.firstElementChild.getBoundingClientRect();
      const mouseYRelativeToTop = e.clientY - elementRect.top;
      const elementHeight = elementRect.height;
      const isMouseInUpperHalf = mouseYRelativeToTop <= elementHeight / 2;

      let newData = [...data];
      let isNeighbours = false; // maybe i need move this to trash

      newData = topHalfLogicHandler(
        newData,
        isMouseInUpperHalf,
        item,
        currentItem,
        draggedItem
      );
      newData = bottomHalfLogicHandler(
        newData,
        isMouseInUpperHalf,
        item,
        currentItem,
        draggedItem
      );

      dispatch(
        updateModifiedData([
          ...new Set([
            ...modifiedData,
            currentItem.parent,
            draggedItem?.parent !== undefined
              ? draggedItem?.parent
              : currentItem.parent,
          ]),
        ])
      );

      dispatch(updateData(newData));
      dispatch(changeDraggedItem(item));
      setIsHalf(isNeighbours ? !isMouseInUpperHalf : isMouseInUpperHalf);
    }
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
              ? isHalf
                ? styles.secondaryTop
                : styles.secondaryBot
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
          onClick={(e) => {
            e.stopPropagation()
            setIsShow((prev) => !prev)
          }}
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
