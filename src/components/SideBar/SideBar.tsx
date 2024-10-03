import { AppStore } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

import styles from "./sidebar.module.css";
import classNames from 'classnames';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LinksArray } from '@/utils';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { createSidebar, updateSidebar } from '@/redux/sidebar';

export interface SidebarInterface {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = () => {

  const sidebarState = useSelector((store: AppStore) => store.sidebar)
  const dispatch = useDispatch();


  const [subnav, setSubnav] = useState(false);

  const showSidebar = () => {
    // setState(prevState => !prevState);
    dispatch(updateSidebar({ state: !sidebarState.state }))
    if (sidebarState.state) {
      setSubnav(false);
    }
  };

  const showSubnav = () => {
    if (!subnav && sidebarState.state) {
      console.log("texto - p");
    } else {
      // setState(prevState => !prevState);
      dispatch(createSidebar(!sidebarState.state))
    }
    setSubnav(prevSubnav => !prevSubnav);
  };

  const location = useLocation();
  return (
    <aside
      className={classNames(styles.aside, {
        [styles.aside_open]: sidebarState.state,
        [styles.aside_close]: !sidebarState.state
      })}
    >
      <nav className={styles.nav}>
        <span
          onClick={showSidebar}
          className={classNames(styles.span, {
            [styles.span_open]: sidebarState.state,
            [styles.span_close]: !sidebarState.state
          })}
        >
          <ArrowForwardIosIcon />
        </span>
        <div
          className={classNames(styles.container, {
            [styles.container_open]: sidebarState.state,
            [styles.container_close]: !sidebarState.state
          })}
        >
          <div className={styles.Logocontent}>
            <div className={styles.imgcontent}>
              {/* <img src={v.logo} /> */}
            </div>
            <h2
              className={classNames({
                [styles.Logocontent_open]: sidebarState.state,
                [styles.Logocontent_close]: !sidebarState.state
              })}
            >
              Tienda Bendición
            </h2>
          </div>

          {LinksArray.map(({ icon, label, to, subNav, iconOpened, iconClosed }) => (
            <li className={styles.LinkLi} key={label}>
              <div
                className={classNames(styles.LinkContainer, {
                  [styles.LinkContainer_active]: sidebarState.state
                })}
              >
                <Link
                  to={to}
                  onClick={subNav && showSubnav}
                  className={classNames(styles.Links, {
                    [styles.active]: location.pathname === to
                  })}
                >
                  <i className={styles.linkicon}>{icon}</i>
                  <span
                    className={classNames({
                      [styles.label_ver]: sidebarState.state,
                      [styles.label_oculto]: !sidebarState.state
                    })}
                  >
                    {label}
                  </span>
                </Link>
              </div>

              {subnav && subNav && (
                <ul className="sub-menu">
                  {subNav.map((item, index) => (
                    <Link
                      to={item.path}
                      key={index}
                      className={classNames(styles.LinkSub)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
