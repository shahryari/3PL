import { type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#f7a400',
    colorError:'#FF0000',
    colorSuccess:'#7BC641',
    colorWarning:'#F7A400',
    fontSize: 14,
    borderRadiusLG:4,
    borderRadiusSM:8,
    colorBorder:'#D9D9D9',
    colorErrorBorder:'#FF0000',
    lineHeightBase: 1.5,
    paddingBase: '12px',
  },
  components: {
    Layout: {
      siderBg: "#F0F0F0",
    },
    Menu: {
        itemHoverBg:'#f7a400',
        itemActiveBg: '#f7a400',
        itemSelectedBg:'#f7a400',
        itemBorderRadius:8,
        itemColor:'#000',
        itemSelectedColor:'#000'
      },
    Breadcrumb: {
          itemColor: "#969696",
          iconFontSize: 14,
          lastItemColor: "#000",
          separatorMargin: 12,
        },
        Pagination:{
          itemActiveBg:"#f7a400"
        },
        Switch: {
                colorPrimary: "#53B761",
                colorPrimaryHover: "#00000",
              },
  },
};

export default theme;
