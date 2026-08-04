import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useTopNavStyles } from "./TopNav.styles";

interface TopNavProps {
  homeLink?: boolean;
}

export default function TopNav({ homeLink = false }: TopNavProps) {
  const navigate = useNavigate();
  const styles = useTopNavStyles();

  return (
    <div className={styles.wrapper}>
      <style>{"@import url(https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap);"}</style>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.logoFrame}>
            <img src={logo} alt="TravelAI logo" className={styles.logo} />
          </div>
          <span className={styles.brandName}>TravelAI</span>
        </div>
        {homeLink ? (
          <button className={styles.homeButton} onClick={() => navigate("/")} type="button">
            <span aria-hidden="true">←</span>
            Home
          </button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
