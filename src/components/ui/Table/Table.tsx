"use client";

import {
  Button,
  Card,
  Input,
  Modal,
  Table as AntTable,
  TableColumnType,
  TableColumnsType,
  menuProps,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Add, InfoCircle, ArrowDown2, Sort } from "iconsax-react";
import { Dropdown, Space } from "../../../../node_modules/antd/es/index";
import "./styles.css";

interface TableProps<T> {
  title: string;
  data: T[];
  columns: TableColumnsType<T>;
  fetchData: (page: number, pageSize: number) => Promise<void>;
  addComponent?: AddItemComponentProps; // Make addComponent optional
  rowKey: string;
}

interface AddItemComponentProps {
  addItemComponent?: React.FC<{ handleCancel: () => void }>;
  title?: string;
}

const Table = <T extends object>({
  title,
  data,
  columns,
  fetchData,
  addComponent, // Make sure addComponent is handled properly
  rowKey,
}: TableProps<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });
  const [searchText, setSearchText] = useState<{ [key: string]: string }>({});
  const searchInput = useRef<Input>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

    useEffect(() => {
      const loadInitialData = async () => {
        setLoading(true);
        await fetchData(pagination.current, pagination.pageSize);
        setLoading(false);
      };

      loadInitialData();
    }, []);

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
    fetchData(pagination.current, pagination.pageSize);
  };

  const handleSearch = (value: string, dataIndex: keyof T) => {
    setSearchText((prev) => ({
      ...prev,
      [dataIndex]: value,
    }));
  };
  const handleFocus = (e, dataIndex) => {
    setFocusedInput(dataIndex as string);
    const inputElement = e.target as HTMLInputElement;
    inputElement.style.width = "90px";
  };

  const handleBlur = (e) => {
    setFocusedInput(null);
    const inputElement = e.target as HTMLInputElement;
    inputElement.style.width = "";
  };
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const getColumnSearchProps = (dataIndex: keyof T): TableColumnType<T> => ({
    title: (
      <>
        <div className="flex align-middle items-center">
          <div>{dataIndex}</div>
          <Input
            ref={searchInput}
            placeholder={`Search `}
            value={searchText[dataIndex] || ""}
            onChange={(e) => handleSearch(e.target.value, dataIndex)}
            onFocus={(e) => handleFocus(e, dataIndex)}
            onBlur={handleBlur}
            onClick={handleClick}
            prefix={
              focusedInput === dataIndex ? (
                <Sort size="32" color="#d9e3f0" variant="Bulk" />
              ) : null
            }
            style={{ marginRight: 8,position:"relative", display: "inline-block" }}
          />
        </div>
      </>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchText[dataIndex] ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText[dataIndex]]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const updatedColumns = columns.map((col) => {
    if (!col.searchable) {
      return col;
    }
    return {
      ...col,
      ...getColumnSearchProps(col.dataIndex as keyof T),
    };
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card title={title} extra={<InfoCircle />}>
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
              {addComponent && addComponent.addItemComponent ? (
                <Button type="primary" size="default" onClick={handleOpen}>
                  <Add className="text-black" />
                  <span className="text-black ">
                    {addComponent.title || "Add Item"}
                  </span>
                </Button>
              ) : null}
              
            </div>
          </div>

          <AntTable
            columns={updatedColumns}
            dataSource={data}
            rowKey={rowKey}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
            }}
            loading={loading}
            scroll={{
              x: "100",
            }}
            onChange={handleTableChange}
          />
        </div>
      </Card>
      <Modal
        title={addComponent?.title || "Add New Item"}
        open={open}
        onOk={handleClose}
        onCancel={handleClose}
      >
        {addComponent?.addItemComponent ? (
          <addComponent.addItemComponent handleCancel={handleClose} />
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default Table;
