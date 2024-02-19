import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

export default function MenuShopIcon({ iconStyle }) {
  return (
    <div className={`${iconStyle}`}>
      <FontAwesomeIcon icon={faShop} />
    </div>
  );
}
