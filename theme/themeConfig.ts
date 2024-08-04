import { type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#f7a400',
    fontSize: 14,
  },
  components: {
    Layout: {
      siderBg: "#F0F0F0",
    },
    Menu: {
        itemHoverBg:'#f7a400',
        itemActiveBg: '#f7a400'
      },
    Breadcrumb: {
          itemColor: "#969696",
          iconFontSize: 14,
          lastItemColor: "#000",
          separatorMargin: 12,
        },
  },
};

export default theme;
