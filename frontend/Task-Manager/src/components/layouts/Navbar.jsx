import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { BRAND_NAME } from "../../utils/brand";
import NotificationBell from "../Notifications/NotificationBell";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="sticky top-0 z-30 flex items-center gap-5 border-b border-slate-200/70 bg-white/90 py-4 px-7 backdrop-blur-md">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="" />
        ) : (
          <HiOutlineMenu className="" />
        )}
      </button>
      <h2 className="text-lg font-medium text-black">{BRAND_NAME}</h2>
      <NotificationBell />
      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
