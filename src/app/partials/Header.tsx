"use client";

import { Tooltip, theme as antTheme } from "antd";

import Image from "next/image";
import Link from "next/link";
import NavbarAvatar from "./NavbarAvatar";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="rounded-xl">
      <div className="flex-row flex space-x-3 items-center justify-between">
        <div className="basis-7/12 flex-row flex space-x-4 gap-x-4 items-center">
          <div className="flex-row flex space-x-3 items-center rtl:space-x-reverse">
            <Link href="/">
              <div
                className={`rounded-full bg-white w-[50px] h-[50px] items-center justify-center flex`}
              >
                <Image
                  src="/images/linari-logo.png"
                  width={35}
                  height={35}
                  alt={"logo"}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-row flex space-x-3 items-center rtl:space-x-reverse m-0">
          <NavbarAvatar />
        </div>
      </div>
    </div>
  );
};

export default Header;
