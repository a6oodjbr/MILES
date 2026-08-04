import { useNavigate } from "react-router-dom";
import TopNav from "../../common/TopNav/TopNav";
import home from "../../assets/image.png";
import { useHomeStyles } from "./home.styles";

const PLAN_TRIP_PATH = "/plan-trip";

export default function Home() {
  const navigate = useNavigate();
  const styles = useHomeStyles();
  const goToPlanner = () => navigate(PLAN_TRIP_PATH);

  return (
    <div className={styles.page}>
      <TopNav />
      <section className={styles.hero}>
        <div className={styles.intro}>
          <h1 className={styles.title}>
            Plan your perfect<br />
            <span className={styles.gradientText}>trip with AI</span>
          </h1>
          <p className={styles.description}>
            Tell us where you&apos;re going and what you love, and get a personalized itinerary with flights,
            activities, must-see places, and hidden gems, all in one place.
          </p>
          <div><button onClick={goToPlanner} className={styles.primaryButton}>Plan Your Trip</button></div>
        </div>
        <div className={styles.visual}>
          <div className={styles.peachBlob} />
          <div className={styles.roseBlob} />
          <div className={styles.photoCard}>
            <img src={home} alt="Wooden boat gliding across a calm mountain lake" className={styles.photo} />
          </div>
        </div>
      </section>
    </div>
  );
}