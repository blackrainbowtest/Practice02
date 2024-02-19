import { useEffect, useState } from "react";
import commonEffect from "./effects.module.css";
import commonStyle from "./style.module.css";

export default function AnimatedContainerLeft({
  HTML_DOM = <h1>U forgot HTML DOM element!</h1>,
  HTML_ICON = <></>,
  primaryStyle = '',
  secondaryStyle = '',
}) {
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    if (!appear) {
      setAppear(true);
    }
  }, [appear]);

  return (
    <div className={`${commonStyle.relative} ${primaryStyle}`}>
      <div
        className={`${secondaryStyle} ${commonEffect.addNewMenuItem} ${commonStyle.animatedFlex} ${
          appear ? commonEffect.appear : null
        }`}
      >
        {HTML_ICON}
        {HTML_DOM}
      </div>
    </div>
  );
}
