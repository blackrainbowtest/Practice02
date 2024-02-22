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
  const [isHalf, setIsHalf] = useState(null);

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

    console.log(data.filter((obj) => obj.parent === draggedItem?.parent));

    // if (draggedItem && currentItem.id !== draggedItem?.id) {
    //   dispatch(dragMenu(data.filter(obj => obj.parent === currentItem.parent)));
    // }
  };

  const dragEndHandle = (e) => {
    e.stopPropagation();
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
      // mouse event
      const elementRect =
        e.currentTarget.firstElementChild.getBoundingClientRect();
      const mouseYRelativeToTop = e.clientY - elementRect.top;
      const elementHeight = elementRect.height;
      const isMouseInUpperHalf = mouseYRelativeToTop <= elementHeight / 2;

      // current and target items
      let currentItemTemp = data.find((obj) => obj.id === currentItem.id);
      let draggedItemTemp = data.find((obj) => obj.id === item.id);

      // change event logic
      if (isMouseInUpperHalf) {
        if (currentItem.parent === item.parent) {
          const newData = data.map((el) => {
            if(el.parent === currentItemTemp.parent) {
              if(currentItemTemp.order < draggedItemTemp.order) { // if item moves from top to bot DONE
                if(el.id === currentItemTemp.id) {
                  return {...el, order: draggedItemTemp.order - 1}
                } else if (el.order <= draggedItemTemp.order - 1 && el.order > currentItemTemp.order) {
                  return {...el, order: el.order - 1}
                }
              } else {                                            // if item moves from bot to top DONE
                if(el.id === currentItemTemp.id) {
                  return {...el, order: draggedItemTemp.order}
                } else if (el.order >= draggedItemTemp.order && el.order < currentItemTemp.order) {
                  return {...el, order: el.order + 1}
                }
              }
              // from bot to top       from top to bot
              // 1   1    1    1       1   1     1    1
              // 2 * 5 2  2    2       2 ↓ 3     3    2
              // 3   2    2 +1 3       3   4     4    3
              // 4   3    3 +1 4       4   2 5-1 4    4
              // 5 ↑ 4    4 +1 5       5 * 5     5    5
              // 6   6    6    6       6   6     6    6
            }
            return el
          })
          dispatch(updateData(newData))
        } else {
          console.log("top logic with different parent", isHalf);
        }
      } else {
        if (currentItem.parent === item.parent) {
          const newData = data.map((el) => {
            if(currentItemTemp.order < draggedItemTemp.order) { // if item moves from top to bot DONE
              if(el.id === currentItemTemp.id) {
                return {...el, order: draggedItemTemp.order}
              }
              if (el.order <= draggedItemTemp.order && el.order > currentItemTemp.order) {
                return {...el, order: el.order - 1}
              }
            } else {                                            // if item moves from bot to top
              if(el.id === currentItemTemp.id) {
                return {...el, order: draggedItemTemp.order + 1}
              }
              if (el.order >= draggedItemTemp.order + 1 && el.order < currentItemTemp.order) {
                return {...el, order: el.order + 1}
              }
            }
            // from top to bot        // from bot to top
            // 1   1     1     1      1   1     1     1
            // 2 ↓ 3     3 -1  2      2 * 2     2     2
            // 3   4     4 -1  3      3   5 2+1 3     3
            // 4   5     5 -1  4      4   3     3 +1  4
            // 5 * 2  5  5     5      5 ↑ 4     4 +1  5
            // 6   6     6     6      6   6     6     6
            return el
          })
          dispatch(updateData(newData))
        } else {
          console.log("bot logic with different parent", isHalf);
        }
      }
      if (draggedItem?.id !== item?.id) {
        // need to be update code and check in lambda func to change item parent to same one
        //   // Logic when current and dragged items isnt in same parent directory
        //   const newData = data.map((el) => {
        //     if (el.id === currentItem.id && draggedItemTemp.order !== 1) {
        //       // Chooesed item loghc WHEN target elm is not first
        //       return {
        //         ...el,
        //         parent: draggedItemTemp.parent,
        //         order: draggedItemTemp.order + 1,
        //       };
        //     } else if (
        //       el.id === currentItem.id &&
        //       draggedItemTemp.order === 1
        //     ) {
        //       // Chooesed item logic WHEN target elm is first
        //       return { ...el, parent: draggedItemTemp.parent, order: 1 };
        //     } else if (
        //       el.parent === currentItemTemp.parent &&
        //       el.order > currentItemTemp.order
        //     ) {
        //       // Chooesed item neighbors logic WHEN he leave directiom
        //       return { ...el, order: el.order - 1 };
        //     } else if (
        //       el.id === draggedItemTemp.id &&
        //       draggedItemTemp.order === 1
        //     ) {
        //       // Chooesed item logic WHEN target elm is first
        //       return { ...el, parent: draggedItemTemp.parent, order: 2 };
        //     } else if (
        //       el.parent === draggedItemTemp.parent &&
        //       el.order > draggedItemTemp.order
        //     ) {
        //       return { ...el, order: el.order + 1 };
        //     }
        //     return el;
        //   });
        //   dispatch(updateData(newData));
        // }
      }
      dispatch(changeDraggedItem(item));
      setIsHalf(isMouseInUpperHalf);
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
