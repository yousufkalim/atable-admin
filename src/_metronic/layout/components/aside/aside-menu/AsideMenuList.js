/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";

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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/dashboard.svg")}/>
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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/team.svg")}/>
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
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/kitchen.svg")}/>
            </span>
              <span className="menu-text">Restaurant</span>
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
