"use client";

import { Button, Flex, Menu, MenuProps, Tag } from "antd";
import { useEffect, useState } from "react";

import style from "./styles/sidemenu.module.scss";
import { usePathname } from "next/navigation";
import { ConfigProvider } from "../../../node_modules/antd/es/index";
import theme from "../../../theme/themeConfig";


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
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("/setting/hotel");
  const [openKey, setOpenKey] = useState("room");
  const pathname = usePathname();

  const hotels: MenuProps["items"] = [
    getItem("انبار", "pms/warehouse", null),
    getItem("کالاها", "room", null, [
      getItem("لیست کالاها", "/pms/roomtype", null),
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
    // router.push("/" + e.key);
  };

  //   useEffec() => {
  //     const path = router.pathname.split("/");

  //     switch (path[1]) {
  //       case "finance":
  //         dispatch.config.setSidebarTitle({
  //           title: "تراکنش ها",
  //           subTitle: "مدیریت تراکنش ها",
  //         });
  //         setActive("/finance/transactions");
  //         break;
  //       case "finance":
  //         dispatch.config.setSidebarTitle({
  //           title: "فاکتور ها",
  //           subTitle: "مدیریت فاکتور ها",
  //         });
  //         setActive("/finance/invoices");
  //         break;
  //     }

  //     switch (path[2]) {
  //       case "hotel":
  //         setActive("/setting/hotel");
  //         break;
  //       case "roles":
  //         setActive("/setting/roles");
  //         break;
  //       case "users":
  //         setActive("/setting/users");
  //         break;
  //       case "transactions":
  //         dispatch.config.setSidebarTitle({
  //           title: "Finance",
  //           subTitle: "مدیریت تراکنش ها",
  //         });
  //         setActive("/finance/transactions");
  //         break;
  //       case "invoices":
  //         dispatch.config.setSidebarTitle({
  //           title: "Finance",
  //           subTitle: "مدیریت فاکتور ها",
  //         });
  //         setActive("/finance/invoices");
  //         break;

  //       case "source":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "مدیریت منابع",
  //         });
  //         setActive("/setting/source");
  //         break;
  //       case "amenity":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "امکانات رفاهی",
  //         });
  //         setOpenKey(path[2]);
  //         setActive("/pms/amenity");
  //         break;
  //       case "rate":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "مدیریت نرخ",
  //         });
  //         setOpenKey(path[2]);
  //         setActive("/pms/rate");
  //         break;
  //       case "guests":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "مدیریت مهمان‌ها",
  //         });
  //         setActive("/pms/guests");
  //         break;
  //       case "policy":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "مدیریت قوانین",
  //         });
  //         setActive("/setting/policy");
  //         break;
  //       case "roomtype":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "نوع اتاق ",
  //         });
  //         setActive("/pms/roomtype");
  //         break;
  //       case "room":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "اتاق ها",
  //         });
  //         setOpenKey(path[2]);
  //         setActive("/pms/room");
  //         break;
  //       case "category":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "دسته بندی ها",
  //         });
  //         setActive("/pms/category");
  //         break;
  //       case "suppliers":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "تامین کنندگان",
  //         });
  //         setActive("/pms/suppliers");
  //         break;
  //       case "warehouse":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "انبار",
  //         });
  //         setActive("/pms/warehouse");
  //         break;
  //       case "minibar":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "مینی‌بار",
  //         });
  //         setActive("/pms/minibar");
  //         break;
  //       case "coupon":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "کوپن های تخفیف",
  //         });
  //         setActive("/pms/coupon");
  //         break;
  //       case "addons":
  //         dispatch.config.setSidebarTitle({
  //           title: "Property management system",
  //           subTitle: "خدمات اضافی",
  //         });
  //         setActive("/pms/addons");
  //         break;
  //     }
  //   }, [router]);

  useEffect(() => {
    const path = pathname.split("/");

    // @ts-ignore
    if (path[1] === "product") setItems(hotels);
    // @ts-ignore
    if (path[1] === "setting") setItems(setting);
    // @ts-ignore
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
        className={`basis-11/12  rounded-tl-3xl rounded-bl-3xl justify-between flex flex-col overflow-y-scroll ${style.mainMenu}`}
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
          <ConfigProvider theme={{ ...theme }}>
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
          </ConfigProvider>
        </div>
      </div>
    </Flex>
  );
};

export default SideMenu;
