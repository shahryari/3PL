import localFont from "next/font/local";

export const yekan = localFont({
  variable: "--font-yekan",
  src: [
    {
      path: "../../public/fonts/YekanBakhFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Light.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-SemiBold.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-ExtraBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-Black.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/YekanBakhFaNum-ExtraBlack.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});
