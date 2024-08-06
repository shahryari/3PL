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

import moment from "moment";

import Breadcrumb from "tpl/components/ui/Breadcrumb/Breadcrumb";
import { UUID } from "crypto";

const { TextArea } = Input;
export interface WarehouseType {
  warehouseID: UUID; 
  warehouseCode: string;
  warehouseName: string;
  description: string;
  cityTitle: string;
  provinceTitle: string;
  addressFinal: string;
  fax: string;
  openTime?: string; 
  closeTime?: string; 
  warehouseAddress: string;
  warehouseTel: string;
  createdOn: Date;
  isActive: boolean;
}

const Warehouses = () => {
  const [data, setData] = useState<WarehouseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Warehouses`,
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
    dataIndex: WarehouseType
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
    dataIndex: WarehouseType
  ): TableColumnType<WarehouseType> => ({
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

  const handleSwitchChange = async (
    checked: boolean,
    record: WarehouseType
  ) => {
    const authToken = Cookies.get(".glctest");

   
  };

const columns: TableColumnsType<WarehouseType> = [
  {
    title: "شناسه",
    dataIndex: "WarehouseID",
    key: "WarehouseID",
    ...getColumnSearchProps("WarehouseID"),
    sorter: (a, b) => a.WarehouseID.localeCompare(b.WarehouseID),
    sortDirections: ["descend", "ascend"],
    hidden: true,
  },
  {
    title: "نام انبار",
    dataIndex: "WarehouseName",
    key: "WarehouseName",
    ...getColumnSearchProps("WarehouseName"),
    sorter: (a, b) => a.WarehouseName.localeCompare(b.WarehouseName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "کد انبار",
    dataIndex: "WarehouseCode",
    key: "WarehouseCode",
    ...getColumnSearchProps("WarehouseCode"),
    sorter: (a, b) => a.WarehouseCode.localeCompare(b.WarehouseCode),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "شهر",
    dataIndex: "CityTitle",
    key: "CityTitle",
    ...getColumnSearchProps("CityTitle"),
    sorter: (a, b) => a.CityTitle.localeCompare(b.CityTitle),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "استان",
    dataIndex: "ProvinceTitle",
    key: "ProvinceTitle",
    ...getColumnSearchProps("ProvinceTitle"),
    sorter: (a, b) => a.ProvinceTitle.localeCompare(b.ProvinceTitle),
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
    title: "وضعیت",
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
    { label: "اطلاعات پایه", href: "#" },
    { label: "انبار", href: "/warehouse" },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbData} />
      <Card title="لیست انبار" extra={<InfoCircle />}>
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
            >
              افزودن کالا
            </div>
          }
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
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
          {/* <AddProduct handleCancel={handleCancel} /> */}
        </Modal>
      </Card>
    </>
  );
};

export default Warehouses;
