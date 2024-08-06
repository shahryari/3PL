"use client";

import { Button, Flex, Menu, MenuProps, Tag } from "antd";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "antd";
import style from "./styles/sidemenu.module.scss";
import theme from "../../../theme/themeConfig";
import { useRouter } from "../../../node_modules/next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    disabled,
  } as MenuItem;
}

const SideMenu = ({ collapsed, setCollapsed }: any) => {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState("/setting/hotel");
  const [openKey, setOpenKey] = useState("room");
  const pathname = usePathname();

  const hotels: MenuProps["items"] = [
    getItem("انبار", "/warehouse", null),
    getItem("کالاها", "/product", null, [
      getItem("لیست کالاها", "/product/products", null),
    ]),
  ];

  const setting: MenuProps["items"] = [
    getItem("Hotel Profile", "/setting/hotel", null),
    getItem("Roles Management", "/setting/roles", null),
    getItem("Users Management", "/setting/users", null),
    getItem("Policy Management", "policy", null, [
      getItem("Policy", "/setting/policy", null),
      getItem("Extradition", "#", null),
      getItem("No show", "#", null),
    ]),
    getItem("Reservation Resources", "/setting/source", null),
  ];

  const finance: MenuProps["items"] = [
    getItem("Transactions", "/finance/transactions", null),
    getItem("Invoices", "/finance/invoices", null),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  useEffect(() => {
    const path = pathname.split("/");

    if (path[1] === "product") setItems(hotels);
    if (path[1] === "warehouse") {setActive("/warehouse");setItems(hotels);};
    if (path[1] === "setting") setItems(setting);
    if (path[1] === "finance") setItems(finance);
  }, [pathname]);

  return (
    <Flex
      className={`${style.sider} flex flex-col items-center justify-start gap-10 pb-3 rounded-tl-lg rounded-bl-lg`}
      align="center"
      justify="space-between"
      vertical
    >
      <div
        className={`basis-11/12 rounded-tl-3xl rounded-bl-3xl justify-between flex flex-col overflow-y-scroll ${style.mainMenu}`}
      >
        <div className="border-b-1 w-full basis-1/12 border-gray-200 p-4 items-center flex-row flex justify-between">
          {!collapsed && (
            <div>
              <h1 className={`text-2xl antialiased font-bold text-black`}>
                محصولات
              </h1>
              <p className={`antialiased font-light text-black`}>محصولات</p>
            </div>
          )}
        </div>
        <div className="basis-full">
          <Menu
            onClick={onClick}
            selectedKeys={[active]}
            defaultSelectedKeys={["hotel"]}
            defaultOpenKeys={[openKey]}
            className={style.siderNavItems}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
          />
        </div>
      </div>
    </Flex>
  );
};

export default SideMenu;
