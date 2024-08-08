"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Breadcrumb from "tpl/components/ui/Breadcrumb/Breadcrumb";
import Table from "tpl/components/ui/Table/Table";
import { message, Switch, Checkbox } from "antd";
import moment from "moment";
import AddProduct from "./Add";

export interface ProductType {
  ProductID: string;
  ProductName: string;
  ProductCode: string;
  GTINCODE: string;
  Description: string;
  Serializable: boolean;
  IsActive: boolean;
  CreatedOn: string;
}

// Define the naturalSort function
const naturalSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const Products = () => {
  const [data, setData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  const getProducts = async (page: number, pageSize: number, filters: any) => {
    setLoading(true);
    const authToken = Cookies.get(".glctest");
    if (!authToken) {
      setLoading(false);
      return;
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("page", page.toString());
    urlencoded.append("rows", pageSize.toString());
    urlencoded.append("sort", "CreatedOn");
    urlencoded.append("order", "Desc");
    urlencoded.append("filterRules", JSON.stringify(filters.filter));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
          body: urlencoded,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const products = await response.json();
      setData(products.rows);
      setPagination((prev) => ({
        ...prev,
        total: products.total,
      }));
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = async (checked: boolean, record: ProductType) => {
    const authToken = Cookies.get(".glctest");
    if (!authToken) {
      message.error("Authentication token is missing");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${record.ProductID}/activate`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isActive: checked }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        message.success("Status updated successfully");
        setData((prevData) =>
          prevData.map((item) =>
            item.ProductID === record.ProductID
              ? { ...item, IsActive: checked }
              : item
          )
        );
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "شناسه محصول",
      dataIndex: "ProductID",
      key: "ProductID",
      align: "center",
      sorter: (a: ProductType, b: ProductType) =>
        naturalSort(a.ProductID, b.ProductID),
      searchable: true,
    },
    {
      title: "نام محصول",
      dataIndex: "ProductName",
      key: "ProductName",
      align: "center",
      sorter: (a: ProductType, b: ProductType) =>
        naturalSort(a.ProductName, b.ProductName),
      searchable: true,
    },
    {
      title: "کد محصول",
      dataIndex: "ProductCode",
      key: "ProductCode",
      align: "center",
      sorter: (a: ProductType, b: ProductType) =>
        naturalSort(a.ProductCode, b.ProductCode),
      searchable: true,
    },
    {
      title: "کد GTIN",
      dataIndex: "GTINCODE",
      key: "GTINCODE",
      align: "center",
      sorter: (a: ProductType, b: ProductType) =>
        naturalSort(a.GTINCODE, b.GTINCODE),
      searchable: true,
    },
    {
      title: "توضیحات",
      dataIndex: "Description",
      key: "Description",
      align: "center",
      searchable: true,
    },
    {
      title: "سریال",
      dataIndex: "Serializable",
      key: "Serializable",
      align: "center",
      render: (Serializable: boolean) => (
        <Checkbox checked={Serializable} disabled />
      ),
      searchable: true,
    },
    {
      title: "وضعیت",
      dataIndex: "IsActive",
      key: "IsActive",
      align: "center",
      render: (IsActive: boolean, record: ProductType) => (
        <Switch
          checked={IsActive}
          onChange={(checked) => handleSwitchChange(checked, record)}
        />
      ),
    },
    {
      title: "تاریخ ثبت",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      align: "center",
      sorter: (a: ProductType, b: ProductType) =>
        naturalSort(a.CreatedOn, b.CreatedOn),
      render: (CreatedOn: string) => (
        <span>{moment(CreatedOn).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
      searchable: true,
    },
  ];

  const breadcrumbItems = [
    { label: "اطلاعات پایه", href: "#" },
    { label: "محصولات", href: "#" },
    { label: "لیست محصولات", href: "/product/products" },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Table
        title="لیست کالاها"
        data={data}
        columns={columns}
        fetchData={getProducts}
        addComponent={{
          addItemComponent: AddProduct,
          title: "افزودن آیتم جدید",
        }}
        rowKey="ProductID"
      />
    </>
  );
};

export default Products;
