/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ContactsIcon from '@material-ui/icons/Contacts';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';


export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };

  return (
      <>
        {/* begin::Menu Nav */}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Level*/}
          <li
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DashboardIcon />
            </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>
          {/* users */}
          <li
              className={`menu-item ${getMenuItemActive("/user", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/user">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
              <span className="menu-text">Users</span>
            </NavLink>
          </li>
          {/* restaurants */}
          <li
              className={`menu-item ${getMenuItemActive("/restaurant", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/restaurant">
            <span className="svg-icon menu-icon">
              <RestaurantIcon />
            </span>
              <span className="menu-text">Restaurant</span>
            </NavLink>
          </li>
          {/* Menu Item */}
          <li
              className={`menu-item ${getMenuItemActive("/menu/", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/menu/">
            <span className="svg-icon menu-icon">
              <MenuBookIcon />
            </span>
              <span className="menu-text">Menu</span>
            </NavLink>
          </li>
          {/* Dishes Managerment */}
          <li
              className={`menu-item ${getMenuItemActive("/dishes/", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/dishes/">
            <span className="svg-icon menu-icon">
              <RestaurantMenuIcon />
            </span>
              <span className="menu-text">Dishes</span>
            </NavLink>
          </li>
          {/* Table Management */}
          <li
              className={`menu-item ${getMenuItemActive("/table", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/table">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/dining-table.svg")}/>
            </span>
              <span className="menu-text">Table Management</span>
            </NavLink>
          </li>

        </ul>

        {/* end::Menu Nav */}
      </>
  );
}
