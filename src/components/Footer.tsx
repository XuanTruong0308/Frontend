import Link from "next/link";
import styles from "@/styles/components/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <h3 className={styles.companyTitle}>Beauty Studio</h3>
            <p className={styles.companyDescription}>
              Nền tảng kết nối dịch vụ làm đẹp chuyên nghiệp, mang đến trải
              nghiệm tuyệt vời cho khách hàng với các dịch vụ makeup, chụp ảnh,
              thuê đồ và nhiều hơn nữa.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                Facebook
              </a>
              <a href="#" className={styles.socialLink}>
                Instagram
              </a>
              <a href="#" className={styles.socialLink}>
                TikTok
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.sectionTitle}>Liên kết nhanh</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/dich-vu" className={styles.footerLink}>
                  Dịch vụ
                </Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/doi-tac" className={styles.footerLink}>
                  Đối tác
                </Link>
              </li>
              <li className={styles.linkItem}>
                {/* <Link href="/lien-he" className={styles.footerLink}>
                  Liên hệ
                </Link> */}
              </li>
              <li className={styles.linkItem}>
                <Link href="/dang-nhap" className={styles.footerLink}>
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={styles.sectionTitle}>Liên hệ</h4>
            <ul className={styles.contactInfo}>
              <li className={styles.contactItem}>
                Email: contact@beautystudio.vn
              </li>
              <li className={styles.contactItem}>Phone: (028) 1234 5678</li>
              <li className={styles.contactItem}>
                Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; 2025 Beauty Studio. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
