import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Breadcrumb as AntBreadcrumb } from "antd";
import { Calendar, Home, InfoCircle, Building3 } from "iconsax-react";
import { ConfigProvider } from "../../../../node_modules/antd/es/index";

export interface BreadcrumbItem {
  label: string;
  href?: string | null;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const pathname = usePathname(); 
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  const getIcon = (route: string) => {
    if (route.startsWith("/product")) {
      return <Building3 size={20} variant="Bulk" className="text-zinc-700" />;
    } else if (route.startsWith("/info")) {
      return <InfoCircle size={20} variant="Bulk" className="text-zinc-700" />;
    } else {
      return <Home size={20} variant="Bulk" className="text-zinc-700" />;
    }
  };

  if (currentRoute === null) {
    return (
      <nav
        aria-label="breadcrumb"
        className="flex items-center space-x-2 text-sm text-gray-600 m-4"
      >
        <AntBreadcrumb separator="/">
          <AntBreadcrumb.Item>
            <Home size={20} variant="Bulk" className="text-zinc-700" />
          </AntBreadcrumb.Item>
          <AntBreadcrumb.Item>
            <span className="text-gray-400">Loading...</span>
          </AntBreadcrumb.Item>
        </AntBreadcrumb>
      </nav>
    );
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Breadcrumb: {
              itemColor: "#969696",
              iconFontSize: 14,
              lastItemColor:"#000",
            },
          },
        }}
      >
        <nav
          aria-label="breadcrumb"
          className="flex items-center space-x-2 text-sm text-gray-600 m-4"
        >
          <AntBreadcrumb separator="/">
            <AntBreadcrumb.Item>
              <Link href="/">{getIcon(currentRoute)}</Link>
            </AntBreadcrumb.Item>
            {items?.map((crumb, index) => (
              <AntBreadcrumb.Item key={index}>
                {crumb.href ? (
                  <Link href={crumb.href}>
                    <span
                      className={`${
                        index === items.length - 1
                          ? "text-black"
                          : "hover:underline"
                      }`}
                    >
                      {crumb.label}
                    </span>
                  </Link>
                ) : (
                  <span
                    className={`${
                      index === items.length - 1 ? "text-black" : ""
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </AntBreadcrumb.Item>
            ))}
          </AntBreadcrumb>
        </nav>
      </ConfigProvider>
    </>
  );
};

export default Breadcrumb;
