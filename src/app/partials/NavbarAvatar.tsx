"use client";

import { Avatar, Dropdown, MenuProps } from "antd";

import Cookies from "js-cookie";
import { Logout } from "iconsax-react";
import { useRouter } from "next/router";

const NavbarAvatar = () => {
  const property = Cookies.get("property");
  const hotelProperty = property ? JSON.parse(property) : null;

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        // logout();
        // handleLogout();
        break;
      case "hotels":
        // dispatch.config.toggleHotelModal();
        break;
      case "management":
        // router.push("/setting/hotel");
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Setting",
      key: "setting",
      disabled: true,
    },
    {
      label: "Manage",
      key: "management",
    },
    {
      label: "Ho",
      key: "hotels",
    },
    {
      type: "divider",
    },
    {
      label: "LLog",
      key: "logout",
      icon: <Logout />,
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items, onClick }} trigger={["click"]}>
      <div
        className={`rounded-full bg-background bg-white h-[48px] items-center justify-center flex px-1 space-x-3 gap-x-2 cursor-pointer hover:text-orange-400 transition-all`}
      >
        <Avatar
          size={42}
          src={
            !hotelProperty?.logo
              ? "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              : hotelProperty?.logo
          }
        />
        <p className="text-black">شرکت لیناری</p>
      </div>
    </Dropdown>
  );
};

export default NavbarAvatar;
