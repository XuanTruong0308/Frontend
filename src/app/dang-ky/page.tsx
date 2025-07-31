import AuthForm from "@/components/AuthForm";
import styles from "@/styles/components/Auth.module.css";

const DangKyPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Đăng ký tài khoản</h1>
            <p className={styles.subtitle}>
              Tham gia cộng đồng Beauty Studio ngay hôm nay
            </p>
          </div>

          <AuthForm type="register" />

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Đã có tài khoản?{" "}
              <a href="/dang-nhap" className={styles.link}>
                Đăng nhập
              </a>
            </p>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <div className={styles.imageContent}>
            <h2 className={styles.imageTitle}>Bắt đầu hành trình làm đẹp</h2>
            <p className={styles.imageDescription}>
              Tạo tài khoản để đặt lịch, theo dõi dịch vụ và nhận những ưu đãi
              độc quyền
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangKyPage;
