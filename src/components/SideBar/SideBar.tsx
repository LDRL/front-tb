import { AppStore } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./sidebar.module.css";
import classNames from 'classnames';
import { LinksArray } from '@/utils';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { updateSidebar, toggleMobileMenu } from '@/redux/sidebar';
import { hasPermission } from '@/modules/auth/helper/auth.helper';

const Sidebar = () => {
  const sidebarState = useSelector((store: AppStore) => store.sidebar);
  const user = useSelector((state: AppStore) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [openSubnav, setOpenSubnav] = useState<string | null>(null);
  const isOpen = sidebarState.state || sidebarState.mobileOpen;

  const hasAnyPermission = (permission: string | string[] | null): boolean => {
    if (!permission) return true;

    const permissions = Array.isArray(permission) ? permission : [permission];

    return permissions.some((p) => hasPermission(user, p));
  };

  const filteredLinks = LinksArray.filter((item) => hasAnyPermission(item.permission));

  const linksWithFilteredSubNav = filteredLinks
    .map((item) => {
      if (!item.subNav) return item;

      const filteredSubNav = item.subNav.filter((subItem) => {
        if (!subItem.permission) return true;
        return hasPermission(user, subItem.permission);
      });

      return {
        ...item,
        subNav: filteredSubNav
      };
    })
    .filter((item) => (item.subNav ? item.subNav.length > 0 : true));

  useEffect(() => {
    const activeParent = linksWithFilteredSubNav.find((item) =>
      item.subNav?.some(
        (subItem) =>
          location.pathname === subItem.path ||
          location.pathname.startsWith(`${subItem.path}/`)
      )
    );

    if (activeParent) {
      setOpenSubnav(activeParent.label);
    }
  }, [location.pathname, user]);

  const handleSubnavClick = (label: string) => {
    if (!isOpen) {
      dispatch(updateSidebar({ state: true }));
    }

    setOpenSubnav((current) => current === label ? null : label);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>,label: string,hasSubNav: boolean) => {
    if (hasSubNav) {
      event.preventDefault();
      handleSubnavClick(label);
      return;
    }

    setOpenSubnav(null);

    if (sidebarState.mobileOpen) {
      dispatch(toggleMobileMenu());
    }
  };

  const closeMobileMenu = () => {
    if (sidebarState.mobileOpen) {
      dispatch(toggleMobileMenu());
    }
  };

  return (
    <>
      {sidebarState.mobileOpen && (
        <div
          className={styles.mobile_backdrop}
          onClick={closeMobileMenu}
        />
      )}
      <aside
        className={classNames(styles.aside, {
          [styles.aside_open]: isOpen,
          [styles.aside_close]: !isOpen,
          [styles.aside_mobile_open]: sidebarState.mobileOpen
        })}
      >
        <nav className={styles.nav}>
          <div
            className={classNames(styles.container_sidebar, {
              [styles.container_open]: isOpen,
              [styles.container_close]: !isOpen
            })}
          >
            <div className={styles.Logocontent}>
              <div className={styles.imgcontent}>
                {/* <img src={v.logo} /> */}
              </div>
              <h2
                className={classNames({
                  [styles.Logocontent_open]: isOpen,
                  [styles.Logocontent_close]: !isOpen
                })}
              >
                Tienda Bendición
              </h2>
            </div>
            <ul className={styles.sidebar_list}>
              {linksWithFilteredSubNav.map(({ icon, label, to, subNav }) => {
                const isActive = location.pathname === to;
                const hasSubNav = !!subNav?.length;
                const hasActiveSubNav = subNav?.some(
                  (item) =>
                    location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`)
                ) ?? false;

                return (
                  <li
                    className={styles.LinkLi}
                    key={label}
                  >
                    <div
                      className={classNames(styles.LinkContainer, {
                        [styles.LinkContainer_active]: isOpen
                      })}
                    >
                      <Link
                        to={to}
                        onClick={(event) => handleLinkClick(event, label, hasSubNav)}
                        className={classNames(styles.Links, {
                          [styles.active]: isActive,
                          [styles.parent_active]: hasActiveSubNav
                        })}
                      >
                        <i className={styles.linkicon}>
                          {icon}
                        </i>
                        <span
                          className={classNames({
                            [styles.label_ver]: isOpen,
                            [styles.label_oculto]: !isOpen
                          })}
                        >
                          {label}
                        </span>
                      </Link>
                    </div>
                    {hasSubNav && (
                      <ul
                        className={classNames(styles.SubMenu, {
                          [styles.SubMenu_open]: openSubnav === label
                        })}
                      >
                        {subNav.map((item, index) => {
                          const isSubActive =
                            location.pathname === item.path ||
                            location.pathname.startsWith(`${item.path}/`);

                          return (
                            <li
                              key={`${item.path}-${index}`}
                              className={styles.SubMenuItem}
                            >
                              <Link
                                to={item.path}
                                className={classNames(styles.LinkSub, {
                                  [styles.LinkSub_active]: isSubActive
                                })}
                                onClick={() => {
                                  setOpenSubnav(null);

                                  if (sidebarState.mobileOpen) {
                                    dispatch(toggleMobileMenu());
                                  }
                                }}
                              >
                                {item.icon && (
                                  <span className={styles.SubLinkIcon}>
                                    {item.icon}
                                  </span>
                                )}
                                <span>
                                  {item.title}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
