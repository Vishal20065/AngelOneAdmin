import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { baseurl } from "../../helper/Helper";

import { useNavigate } from "react-router-dom";
const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
 
const [auth, setAuth] = useAuth();

const user = JSON.parse(localStorage.getItem('user'))


  const navigate = useNavigate()


  const handleLogout = async() => {
     
    await axios.get(`${baseurl}/api/users/logout/${user._id}`)

    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  // Navigation items
  const navItems = [
    { name: "Profits", path: "/admin/profits" },
    { name: "Fund Added", path: "/admin/fundAdded" },
    { name: "FundWithDraw", path: "/admin/fundWithDraw" },
    { name: "Profile", path: "/admin/profile" },
    { name: "Order1", path: "/admin/order1" },
    { name: "Order2", path: "/admin/order2" },
  ];

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center gap-2">
        {/* Hamburger only visible on mobile */}
        <Button
          type="text"
          icon={<MenuOutlined className="text-xl" />}
          onClick={showDrawer}
          className="lg:hidden"
        />
        {/* <h1 className="font-bold text-xl text-blue-600">MyApp</h1> */}
      </div>

      {/* Center: Nav Links (desktop only) */}
      <nav className="hidden lg:flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-gray-700 font-medium transition-colors hover:text-blue-600 ${
              location.pathname === item.path ? "text-blue-600" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Right: Login Button */}
      <div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 hover:bg-red-700 px-5 font-semibold p-2 text-amber-50"
        >
          LogOut
        </button>
      </div>

      {/* Drawer for Mobile (hidden on lg) */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={onClose}
        open={open}
        className="lg:hidden"
      >
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onClose}
                className={`block text-gray-700 font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.path ? "text-blue-600" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    </header>
  );
};

export default Header;
