import type { CSSProperties } from "react";
import { colors, warm } from "../../common/theme/colors";
import { useSplashScreenStyles } from "./splashScreen.styles";

const symbols = [
  "\u2708",
  "\u2316",
  "\u25C8",
  "\u2301",
  "\u25C9",
  "\u2726",
  "\u2302",
  "\u2727",
];
const palette = [
  colors.coral,
  colors.rose,
  warm.coralBright,
  warm.textTertiary,
  colors.peach,
  colors.brown,
];

const TravelPattern = () => {
  const styles = useSplashScreenStyles();

  return (
    <div aria-hidden="true" className={styles.pattern}>
      {Array.from({ length: 18 }, (_, index) => {
        const left = `${4 + ((index * 23) % 92)}%`;
        const top = `${10 + ((index * 31) % 78)}%`;
        const rotation = ((index * 29) % 60) - 30;
        const itemStyle = {
          left,
          top,
          color: palette[index % palette.length],
          opacity: 0.1 + (index % 4) * 0.015,
          fontSize: `${30 + (index % 4) * 8}px`,
          transform: `rotate(${rotation}deg)`,
        } as CSSProperties;

        return (
          <span
            key={`${left}-${top}-${rotation}`}
            className={styles.patternItem}
            style={itemStyle}
          >
            {symbols[index % symbols.length]}
          </span>
        );
      })}
    </div>
  );
};

export default TravelPattern;
