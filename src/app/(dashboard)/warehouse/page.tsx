"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Breadcrumb from "tpl/components/ui/Breadcrumb/Breadcrumb";
import Table from "tpl/components/ui/Table/Table";
import {
  message,
  Checkbox,
  Dropdown,
  Card,
  MenuProps,
  Modal,
  Form,
  Input,
  Button,
  Switch,
  TimePicker,
  Select,
  DatePicker,
  Divider,
} from "antd";
import format from "dayjs";
import { Add, ArrowDown2, CloseCircle, DocumentDownload } from "iconsax-react";

const { RangePicker } = DatePicker;
const { Option } = Select;

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
  const [open, setOpen] = useState(false);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const onFinish = (values: any) => {
    console.log("موفقیت:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("شکست:", errorInfo);
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
        <span>{format(CreatedOn).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
      searchable: true,
    },
  ];

  const breadcrumbItems = [
    { label: "اطلاعات پایه", href: "#" },
    { label: "انبار", href: "#" },
    { label: "لیست انبار", href: "/warehouse/warehouses" },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          حذف
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          کپی
        </a>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Card>
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between">
            <Dropdown menu={{ items }}>
              <Button>
                <div className="flex items-center justify-between gap-x-2">
                  اکشن دسته جمعی
                  <ArrowDown2 size={18} />
                </div>
              </Button>
            </Dropdown>
            <div className="flex items-center gap-2">
              <Button>
                <DocumentDownload size={20} variant="TwoTone" />
                خروجی CSV
              </Button>
              <Button type="primary" onClick={handleOpen}>
                <Add />
                افزودن افزودن آیتم جدید
              </Button>
            </div>
          </div>
          <Table
            title="لیست انبارها"
            data={data}
            columns={columns}
            fetchData={getProducts}
            rowKey="ProductID"
          />

          <Modal
            title={"افزودن انبار جدید"}
            closeIcon={<CloseCircle />}
            open={open}
            onOk={handleClose}
            onCancel={handleClose}
            footer={[]}
            width={900}
          >
            <Divider />
            <Form
              name="warehouseForm"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="space-y-6"
              size="large"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  label="کد انبار"
                  name="warehouseCode"
                  rules={[
                    { required: true, message: "لطفاً کد انبار را وارد کنید!" },
                  ]}
                >
                  <Input
                    placeholder="کد انبار را وارد کنید"
                    className="rounded-md shadow-sm"
                  />
                </Form.Item>

                <Form.Item
                  label="نام انبار"
                  name="warehouseName"
                  rules={[
                    {
                      required: true,
                      message: "لطفاً نام انبار را وارد کنید!",
                    },
                  ]}
                >
                  <Input
                    placeholder="نام انبار را وارد کنید"
                    className="rounded-md shadow-sm"
                  />
                </Form.Item>

                <Form.Item
                  label="استان"
                  name="province"
                  rules={[
                    { required: true, message: "لطفاً استان را انتخاب کنید!" },
                  ]}
                >
                  <Select
                    placeholder="استان را انتخاب کنید"
                    className="rounded-md shadow-sm"
                  >
                    {/* Replace with actual province options */}
                    <Option value="province1">استان ۱</Option>
                    <Option value="province2">استان ۲</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="شهر"
                  name="city"
                  rules={[
                    { required: true, message: "لطفاً شهر را انتخاب کنید!" },
                  ]}
                >
                  <Select
                    placeholder="شهر را انتخاب کنید"
                    className="rounded-md shadow-sm"
                  >
                    {/* Replace with actual city options */}
                    <Option value="city1">شهر ۱</Option>
                    <Option value="city2">شهر ۲</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="آدرس"
                  name="address"
                  rules={[
                    { required: true, message: "لطفاً آدرس را وارد کنید!" },
                  ]}
                >
                  <Input
                    placeholder="آدرس را وارد کنید"
                    className="rounded-md shadow-sm"
                  />
                </Form.Item>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Form.Item label="شماره تماس (اختیاری)" name="phoneNumber">
                  <Input
                    type="number"
                    placeholder="شماره تماس را وارد کنید"
                    className="rounded-md shadow-sm"
                  />
                </Form.Item>
                <Form.Item label="کدپستی" name="postalCode">
                  <Input
                    type="number"
                    placeholder="کدپستی را وارد کنید"
                    className="rounded-md shadow-sm"
                  />
                </Form.Item>

                <Form.Item label="ساعت پایان کار" name="endTime">
                  <TimePicker format="HH:mm" className="rounded-md shadow-sm" />
                </Form.Item>

                <Form.Item label="ساعت شروع کار" name="startTime">
                  <TimePicker format="HH:mm" className="rounded-md shadow-sm" />
                </Form.Item>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item label="موقعیت جغرافیایی" name="location">
                  <Button type="default" className="w-full">
                    تنظیم موقعیت
                  </Button>
                </Form.Item>

                <div className="bg-gray-100 flex flex-row items-center justify-between h-10 rounded-lg px-6 mt-[30px]">
                  <p>وضعیت</p>
                  <Form.Item
                    label=""
                    name="status"
                    valuePropName="checked"
                    className="!m-0"
                  >
                    <Switch />
                  </Form.Item>
                </div>

                {/* Empty item for spacing */}
                <Form.Item>
                  <div></div>
                </Form.Item>
              </div>

              <div className="flex gap-x-2 justify-end">
                <Form.Item className="!mb-0">
                  <Button
                    size="small"
                    type="primary"
                    htmlType="submit"
                    className="w-full !bg-green-600 !h-8 !hover:bg-green-900 !px-4 !text-white"
                  >
                    ذخیره
                  </Button>
                </Form.Item>
                <Form.Item className="!mb-0">
                  <Button
                    size="small"
                    className="w-full !bg-white !h-8  !px-4 !text-black"
                  >
                    انصراف
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Modal>
        </div>
      </Card>
    </>
  );
};

export default Products;
