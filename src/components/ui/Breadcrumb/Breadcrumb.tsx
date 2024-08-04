import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb as AntBreadcrumb } from "antd";
import { Calendar, Home, InfoCircle, Building3 } from "iconsax-react";
import { ConfigProvider } from "../../../../node_modules/antd/es/index";
import theme from "../../../../theme/themeConfig";

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
        <AntBreadcrumb
          separator="/"
          items={[
            {
              title: (
                <Home size={20} variant="Bulk" className="text-zinc-700" />
              ),
            },
            {
              title: <span className="text-gray-400">Loading...</span>,
            },
          ]}
        />
      </nav>
    );
  }

  const breadcrumbItems = [
    {
      title: <Link href="/">{getIcon(currentRoute)}</Link>,
    },
    ...items.map((crumb, index) => ({
      title: crumb.href ? (
        <Link href={crumb.href}>
          <span
            className={`${
              index === items.length - 1 ? "text-black" : "hover:underline"
            }`}
          >
            {crumb.label}
          </span>
        </Link>
      ) : (
        <span className={`${index === items.length - 1 ? "text-black" : ""}`}>
          {crumb.label}
        </span>
      ),
    })),
  ];

  return (
    <>
      <ConfigProvider theme={{ ...theme }}>
        <nav
          aria-label="breadcrumb"
          className="flex items-center space-x-2 text-sm text-gray-600 m-4"
        >
          <AntBreadcrumb separator="/" items={breadcrumbItems} />
        </nav>
      </ConfigProvider>
    </>
  );
};

export default Breadcrumb;
