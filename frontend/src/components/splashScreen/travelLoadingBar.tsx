import { useSplashScreenStyles } from "./splashScreen.styles";

const TravelLoadingBar = () => {
  const styles = useSplashScreenStyles();

  return (
    <div className={styles.loadingBarRoot}>
      <span className={styles.startDot} />
      <span className={styles.route} />
      <span className={styles.endDot} />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={styles.plane}
        fill="currentColor"
      >
        <path d="M21.7 3.2c-.4-.4-1-.4-1.4-.1L13 8.2 5.2 6.6l-1.6 1.6 6 3.3-3.1 3.1-2.2-.4-1.1 1.1 3.1 1.7 1.7 3.1 1.1-1.1-.4-2.2 3.1-3.1 3.3 6 1.6-1.6L15.8 11l5.1-7.3c.3-.4.3-1-.1-1.4Z" />
      </svg>
    </div>
  );
};

export default TravelLoadingBar;
