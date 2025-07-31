import ProfileInfo from "@/components/Profile";
import styles from "@/styles/components/Auth.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <div
        className={styles.formWrapper}
        style={{ gridTemplateColumns: "1fr", maxWidth: "600px" }}
      >
        <div className={styles.formContainer}>
          <ProfileInfo />
        </div>
      </div>
    </div>
  );
}
