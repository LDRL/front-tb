import styles from './footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>POS &copy; {year}</span>
      <span className={styles.separator}>|</span>
      <span>Código Arte</span>
    </footer>
  );
};

export default Footer;
