import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AppStore } from '@/redux/store'
import { toggleMobileMenu, updateSidebar } from '@/redux/sidebar'
import { logout, userKey } from '@/redux/authSlice'
import { clearLocalStorage } from '@/utils/localStorage.utility'
import { PublicRoutes } from '@/models'
import styles from "./header.module.css"
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'


const Header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sidebar = useSelector((store: AppStore) => store.sidebar)
  const user = useSelector((store: AppStore) => store.auth.user)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  )
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fullName = `${user.firstName} ${user.lastName}`.trim()

  const handleLogout = () => {
    clearLocalStorage(userKey)
    dispatch(logout())
    navigate(PublicRoutes.LOGIN, { replace: true })
  }

  const handleToggleMenu = () => {
    
    if (isMobile) {
      dispatch(toggleMobileMenu())
    } else {
      dispatch(updateSidebar({ state: !sidebar.state }))
    }
  }

  const isSidebarOpen = isMobile ? sidebar.mobileOpen : sidebar.state

  return (
    <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.menu_group}>
            <button
              className={styles.menu_btn}
              onClick={handleToggleMenu}
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
              id="toggleMenu"
            >
              {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <h2 className={styles.custom_text}>
              Tienda la bendición
            </h2>
          </div>

            <div className={styles.profile} ref={profileRef}>
              <button
                type="button"
                className={styles.profile_btn}
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={open}
              >
                {user.image ? (
                  <img src={user.image} alt="avatar" className={styles.avatar} />
                ) : (
                  <span className={styles.avatar}><PersonIcon /></span>
                )}

                <span className={styles.profile_info}>
                  <span className={styles.profile_name}>{fullName || user.username}</span>
                  <span className={styles.profile_role}>{user.roles[0]?.name}</span>
                </span>

              </button>

              {open && (
                <div className={styles.dropdown}>
                  <button
                    type="button"
                    className={styles.dropdown_item}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
        </div>
    </header>
  )
}

export default Header