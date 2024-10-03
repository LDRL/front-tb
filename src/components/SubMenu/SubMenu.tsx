
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import styled from "styled-components";
import "./SubMenu.css";

export interface SubMenuInterface {
    item: {
      path: string;
      icon: JSX.Element;
      title: string;
      subNav?: {
        path: string;
        title: string;
      }[];
      iconOpened?: JSX.Element;
      iconClosed?: JSX.Element;
    };
}

//   const Sidebar:React.FC<SidebarInterface> =  ({state,setState}) => {

const SubMenu: React.FC<SubMenuInterface> = ({item }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <li className={`${subnav ? "showMenu" : ""}`}>
                <div className="iocn-link">

                    <Link to={item.path}
                        onClick={item.subNav && showSubnav}
                    >
                        <i className="bx">{item.icon}</i>

                        <span className="link_name">{item.title}</span>

                    </Link>
                    <i className="bx arrow">
                        {item.subNav && subnav
                            ? item.iconOpened
                            : item.subNav
                                ? item.iconClosed
                                : null}
                    </i>

                </div>

                {item.subNav ? <ul className="sub-menu">
                    
                </ul> : ''}

            </li>
        </>
    );
};

export default SubMenu;