import AddInput from "../../_common/AddInput";
import AnimatedContainerLeft from "../../_common/AnimatedContainerLeft";
import MenuShopIcon from "./Icons/MenuShopIcon";
import styles from "./style.module.css"

export default function MenuEditMenuComponent({ setIsEdit, editMenu, name }) {
  return (
    <AnimatedContainerLeft
      HTML_ICON = {
        <MenuShopIcon iconStyle={styles.menuIcon}/>
      }
      HTML_DOM={
        <AddInput
          setIsClicked={setIsEdit}
          inputData={editMenu}
          defaultName={name}
        />
      }
    />
  );
}
