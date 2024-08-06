import React, { useState } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { DataType } from "./page";
import {
  Alert,
  Col,
  Row,
  Switch,
} from "../../../../../node_modules/antd/es/index";

const { TextArea } = Input;

const AddProduct = ({
  onFinish,
  handleCancel,
}: {
  onFinish: (values: DataType) => void;
  handleCancel: () => void;
}) => {
  const [isSerializable, setIsSerializable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const onFinishHandler = async (values: DataType) => {
    setAlertMessage(null); // Clear previous alert message
    setAlertType("info"); // Reset alert type

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ProductInsert`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (!result.IsSucceed) {
          const errorMessage =
            result?.Messages?.[0] || "An unknown error occurred";
          setAlertMessage(`${errorMessage}`);
          setAlertType("error");
        } else {
          setAlertMessage("Product added successfully");
          setAlertType("success");
          onFinish(values);
        }
      } else {
        const errorText = await response.text();
        const parser = new DOMParser();
        const errorDoc = parser.parseFromString(errorText, "application/xml");
        const errorMessage =
          errorDoc.getElementsByTagName("Message")[0]?.textContent ||
          "یک خطا رخ داده است";
        setAlertMessage(`${errorMessage}`);
        setAlertType("error");
      }
    } catch (error) {
      const errorMessage = (error as Error)?.message || "یک خطا رخ داده است";
      setAlertMessage(errorMessage);
      setAlertType("error");
    }
  };

  return (
    <Form name="product-form" onFinish={onFinishHandler} autoComplete="off">
      {alertMessage && (
        <Form.Item wrapperCol={{ span: 24 }}>
          <Alert message={alertMessage} type={alertType} showIcon closable />
        </Form.Item>
      )}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="کد محصول"
            name="ProductCode"
            rules={[{ required: true, message: "کد محصول را وارد کنید" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="نام محصول"
            name="ProductName"
            rules={[{ required: true, message: "نام محصول را وارد کنید" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="GTINCODE"
            name="GTINCODE"
            rules={[{ required: true, message: "Please input GTINCODE!" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              size="large"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="توضیحات"
        name="Description"
        rules={[{ required: false, message: "Please input Description!" }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <TextArea rows={4} maxLength={6} />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label=""
            name="Serializable"
            valuePropName="checked"
            initialValue={false}
          >
            <div className="flex items-center justify-between bg-[#F8F8F8] p-3 rounded-full w-56">
              <label className="">Serializable</label>
              <div className="flex items-center">
                <span className="ml-2">
                  {isSerializable ? "فعال" : "غیرفعال"}
                </span>
                <Switch
                  size="large"
                  onChange={(checked) => setIsSerializable(checked)}
                />
              </div>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label=""
            name="IsActive"
            valuePropName="checked"
            initialValue={true}
          >
            <div className="flex items-center justify-between bg-[#F8F8F8] p-3 rounded-full w-56">
              <label className="">وضعیت</label>
              <div className="flex items-center">
                <span className="ml-2">{isActive ? "فعال" : "غیرفعال"}</span>
                <Switch
                  size="large"
                  onChange={(checked) => setIsActive(checked)}
                  defaultChecked
                />
              </div>
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div className="flex justify-start space-x-2">
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-green-600 ml-2"
          >
            ذخیره
          </Button>
          <Button onClick={handleCancel} className="!bg-gray-200">
            انصراف
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default AddProduct;
