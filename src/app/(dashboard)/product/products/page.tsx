"use client";

import { Add, ArrowDown2, InfoCircle, SearchNormal } from "iconsax-react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  InputRef,
  MenuProps,
  Modal,
  Space,
  Switch,
  Table,
  TableColumnType,
  TableColumnsType,
  message,
} from "antd";
import type { DraggableData, DraggableEvent } from "react-draggable";
import { useEffect, useRef, useState } from "react";

import Cookies from "js-cookie";
import Draggable from "react-draggable";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import Breadcrumb, {
  BreadcrumbItem,
} from "./../../../../components/ui/Breadcrumb/Breadcrumb";
import moment from "moment";

interface DataType {
  ProductID: string;
  ProductName: string;
  ProductCode: string;
  GTINCODE: string;
  Description: string;
  Serializable: boolean;
  IsActive: boolean;
  CreatedOn: string;
  AlphanumericField: string; // Added the AlphanumericField
}

type DataIndex = keyof DataType;

const Products = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const getProducts = async (page: number, pageSize: number) => {
    setLoading(true);
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      setLoading(false);
      return;
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("page", page.toString());
    urlencoded.append("rows", pageSize.toString());
    urlencoded.append("sort", "CreatedOn");
    urlencoded.append("order", "Desc");

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
        total: products.total, // Update total number of items
      }));
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const draggleRef = useRef<HTMLDivElement>(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const items: MenuProps["items"] = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
      danger: true,
    },
    {
      label: "4rd menu item",
      key: "4",
      danger: true,
      disabled: true,
    },
  ];

  const menuProps = {
    items,
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`جستجو کنید...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchNormal size={14} />}
            size="small"
            style={{ width: 90 }}
          >
            جستجو
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            بازنشانی
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            فیلتر
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            بستن
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchNormal
        style={{ color: filtered ? "#1677ff" : undefined }}
        size={14}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const handleSwitchChange = async (checked: boolean, record: DataType) => {
    const authToken = Cookies.get("authToken");
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
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      message.error(`Failed to update status: ${error.message}`);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "شناسه",
      dataIndex: "ProductID",
      key: "ProductID",
      ...getColumnSearchProps("ProductID"),
      sorter: (a, b) => a.ProductID.localeCompare(b.ProductID),
      sortDirections: ["descend", "ascend"],
      hidden: true,
    },
    {
      title: "نام کالا",
      dataIndex: "ProductName",
      key: "ProductName",
      ...getColumnSearchProps("ProductName"),
      sorter: (a, b) => a.ProductName.localeCompare(b.ProductName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "کد کالا",
      dataIndex: "ProductCode",
      key: "ProductCode",
      ...getColumnSearchProps("ProductCode"),
      sorter: (a, b) => a.ProductCode.localeCompare(b.ProductCode),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "کد GTIN",
      dataIndex: "GTINCODE",
      key: "GTINCODE",
      ...getColumnSearchProps("GTINCODE"),
      sorter: (a, b) => a.GTINCODE.localeCompare(b.GTINCODE),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "توضیحات",
      dataIndex: "Description",
      key: "Description",
      ...getColumnSearchProps("Description"),
      sorter: (a, b) => a.Description.length - b.Description.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "فعال",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (_, record) => (
        <Switch
          checked={record.IsActive}
          onChange={(checked) => handleSwitchChange(checked, record)}
        />
      ),
      sorter: (a, b) => Number(a.IsActive) - Number(b.IsActive),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "تاریخ ایجاد",
      dataIndex: "CreatedOn",
      key: "CreatedOn",
      render: (text) => moment(text).format("YYYY/MM/DD - HH:mm"), // Format the date
      sorter: (a, b) =>
        new Date(a.CreatedOn).getTime() - new Date(b.CreatedOn).getTime(),
      sortDirections: ["descend", "ascend"],
    },
  ];

  const breadcrumbData: BreadcrumbItem[] = [
    { label: "کالا", href: "#" },
    { label: "لیست کالاها", href: "/product/products" }, // No href for the current page
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbData} />
      <Card title="لیست کالاها" extra={<InfoCircle />}>
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between">
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  اکشن دسته جمعی
                  <ArrowDown2 size={18} />
                </Space>
              </Button>
            </Dropdown>
            <div>
              <Button
                type="primary"
                className="flex flex-row items-center"
                onClick={showModal}
              >
                <Add className="text-black" />
                <span className="text-black">افزودن آیتم جدید</span>
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              hideOnSinglePage: true,
              position: ["bottomLeft"],
            }}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>

        <Modal
          centered
          title={
            <div
              style={{ width: "100%", cursor: "move" }}
              onMouseOver={() => {
                if (disabled) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                setDisabled(true);
              }}
              onFocus={() => {}}
              onBlur={() => {}}
            >
              افزودن کالا
            </div>
          }
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => <></>}
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              nodeRef={draggleRef}
              onStart={(event, uiData) => onStart(event, uiData)}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Form name="basic" autoComplete="off">
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-green-600"
              >
                ذخیره
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
};

export default Products;
