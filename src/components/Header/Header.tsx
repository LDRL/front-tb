import { useDispatch, useSelector } from 'react-redux'
import { AppStore } from '@/redux/store'
import { toggleMobileMenu } from '@/redux/sidebar'
import { Logout } from '../Logout'
import styles from "./header.module.css"
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'


const Header = () => {

  const dispatch = useDispatch()
  const mobileOpen = useSelector((store: AppStore) => store.sidebar.mobileOpen)

  return (
    <header className={styles.header}>
        <div className={styles.content}>
            <button
              className={styles.menu_btn}
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <h2 className={styles.custom_text}>
              Tienda la bendición
            </h2>

            <div className={styles.custom_flex}>
              <Logout />
            </div>
        </div>
    </header>
  )
}

export default Header
