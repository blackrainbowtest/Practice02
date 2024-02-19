import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import AddInput from "../../_common/AddInput";
import { addMenu } from "../../../features/menu/menuAPI";
import AnimatedContainerLeft from "../../_common/AnimatedContainerLeft";

export default function AddNewMenuButtonComponent({ setIsClicked }) {

  const dispatch = useDispatch();
  const data = useSelector((state) => state?.menu?.data);
  const createNewMenu = (callback) => {
    dispatch(addMenu({ name: callback, order: data.length + 1 }));
  };

  return (
    <AnimatedContainerLeft
      HTML_DOM={
        <AddInput setIsClicked={setIsClicked} inputData={createNewMenu} />
      }
      primaryStyle={styles.paddingContainer}
    />
  );
}
