import styles from "./style.module.css";
import AddInput from "../../_common/AddInput";
import AnimatedContainerLeft from "../../_common/AnimatedContainerLeft";

export default function MenuItemAddSubMenuComponent({
  setIsAdd,
  addNewSubMenu,
  name
}) {
  return (
    <AnimatedContainerLeft
      HTML_DOM={
        <AddInput
          setIsClicked={setIsAdd}
          inputData={addNewSubMenu}
          defaultName={name}
        />
      }
      primaryStyle={styles.addNewSubMenu}
    />
  );
}
