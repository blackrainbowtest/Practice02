import MenuShopIcon from "./Icons/MenuShopIcon";
import styles from "./style.module.css";

export default function MenuItemName({ name }) {
  return (
    <div style={{ width: "100%", display: "flex", gap: "5px" }}>
      <MenuShopIcon iconStyle={styles.menuIcon} />
      {name}
    </div>
  );
}
