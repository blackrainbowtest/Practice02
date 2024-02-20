import { useEffect, useState } from "react";
import AddNewMenuButtonComponent from "./_components/AddNewMenuIButtonComponent";
import AddNewMenuItemComponent from "./_components/AddNewMenuItemComponent";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getMenu } from "../../features/menu/menuAPI";
import MenuItemComponent from "./_common/MenuItemComponent";

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const data = useSelector((state) => state?.menu?.data);
  const loading = useSelector((state) => state?.menu?.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMenu());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.addNewMenu}>
        <AddNewMenuButtonComponent
          isClicked={isClicked}
          setIsClicked={setIsClicked}
        />
        {isClicked ? (
          <AddNewMenuItemComponent setIsClicked={setIsClicked} />
        ) : null}
      </div>
      <div className={`${styles.addNewMenu}, ${styles.menuContainer}`}>
        {loading ? (
          <>Loading...</>
        ) : (
          data
            .slice()
            .filter(item => item.parent === null)
            .sort((a, b) => a.order - b.order)
            .map((item) => <MenuItemComponent key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
