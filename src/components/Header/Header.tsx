import { Link } from 'react-router-dom'
import { Logout } from '../Logout'
import styles from "./header.module.css"


const Header = () => {


  return (
    //header
    //content
    //titulo

    <header className={styles.header}> 
        <div className={styles.content}>
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