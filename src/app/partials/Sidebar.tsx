"use client";

import { Avatar, Layout, MenuProps } from "antd";
import {
  Building3,
  Calendar,
  Category2,
  DollarCircle,
  Logout,
  LogoutCurve,
} from "iconsax-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import SideMenu from "./SideMenu";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const Sidebar = () => {
  const [active, setActive] = useState("/");
  const [activeMenu, setActiveMenu] = useState("");
  const pathname = usePathname();

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        break;
      case "hotels":
        // dispatch.config.toggleHotelModal();
        break;
      case "profile":
        // router.push("/setting/profile");
        break;
      case "management":
        // router.push("/setting/hotel");
        break;
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "",
      key: "0",
      icon: (
        <Avatar
          className="cursor-pointer "
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          size={40}
        />
      ),
      children: [
        {
          label: "Profile",
          key: "profile",
        },
        {
          label: "Hotel",
          key: "management",
        },
        {
          label: "List",
          key: "hotels",
        },
        {
          type: "divider",
        },
        {
          label: "Logout",
          key: "logout",
          icon: <Logout />,
          danger: true,
        },
      ],
    },
  ];

  useEffect(() => {
    const path = pathname.split("/");
    switch (path[1]) {
      case "/":
        setActiveMenu("/");
        setActive("/");
        break;
      case "product":
        setActiveMenu("product");
        setActive("/product/products");
        break;
      case "crs":
        setActiveMenu("crs");
        setActive("/crs");
        break;
      case "finance":
        setActiveMenu("finance");
        setActive("/finance/transactions");
        break;
      default:
        // @ts-ignore
        setActiveMenu("pms");
        setActive("/");
        break;
    }
  }, []);

  const renderSidebar = () => {
    const path = pathname.split("/");
    if (path[1] === "") return <></>;

    return <SideMenu collapsed={false} />;
  };

  return (
    <div
      className={`bg-white inline-flex flex-row h-full min-w-12 rounded-lg
      `}
    >
      <div
        className={`items-center bg-white flex flex-col justify-between w-12 rounded-lg h-full py-8`}
      >
        <div className="flex flex-col items-center justify-between gap-y-8 menu-sider">
          <Link
            href={"/"}
            className={`hover:bg-primary-400 rounded-full transition-all b h-9 w-9 flex justify-center items-center relative z-1 ${
              pathname.split("/")[1] === "" && "active bg-primary-500"
            }`}
          >
            <Category2
              size={24}
              variant="Bulk"
              className={`${active === "/" ? "text-black" : "text-zinc-700"}`}
            />
          </Link>
          <Link
            href={"/product/products"}
            className={`hover:bg-primary-400 rounded-full transition-all b h-9 w-9 flex justify-center items-center relative z-1  ${
              pathname.split("/")[1] === "product" && "active bg-primary-500"
            }`}
          >
            <Building3
              size={24}
              variant="Bulk"
              className={`${
                active === "/pms/roomtype" ? "text-black" : "text-zinc-700"
              } `}
            />
          </Link>
          <Link
            href={"/crs"}
            className={`hover:bg-primary-400 rounded-full transition-all b h-9 w-9 flex justify-center items-center relative z-1  ${
              pathname.split("/")[1] === "finance" && "active bg-primary-500"
            }`}
          >
            <Calendar
              size={24}
              variant="Bulk"
              className={`${
                active === "/crs" ? "text-zinc-900" : "text-zinc-700"
              }`}
            />
          </Link>
          <Link
            href={"/finance/transactions"}
            className={` hover:bg-orange-50 rounded-full transition-all`}
          >
            <DollarCircle
              size={24}
              variant="Bulk"
              className={`${
                active === "/finance/transactions"
                  ? "text-zinc-900"
                  : "text-zinc-500"
              }`}
            />{" "}
          </Link>
        </div>
        <Link
          href="/setting/hotel"
          className="bg-zinc-200 p-2 rounded-full m-1"
        >
          <LogoutCurve variant="Bulk" className="text-zinc-700" />
        </Link>
      </div>
      {renderSidebar()}
    </div>
  );
};

export default Sidebar;
