import AuthForm from "@/components/AuthForm";
import styles from "@/styles/components/Auth.module.css";

const DangNhapPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Đăng nhập</h1>
            <p className={styles.subtitle}>
              Chào mừng bạn quay trở lại Beauty Studio
            </p>
          </div>

          <AuthForm type="login" />

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Chưa có tài khoản?{" "}
              <a href="/dang-ky" className={styles.link}>
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <div className={styles.imageContent}>
            <h2 className={styles.imageTitle}>Khám phá thế giới làm đẹp</h2>
            <p className={styles.imageDescription}>
              Kết nối với các chuyên gia làm đẹp hàng đầu và trải nghiệm dịch vụ
              chất lượng cao
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangNhapPage;
