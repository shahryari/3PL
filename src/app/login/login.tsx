"use client";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Lock, Sms } from "iconsax-react";
import Image from "next/image";
import React, { useState } from "react";
import Cookies from "js-cookie";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Assuming the API returns a token or session ID
      const { TokenID, FullName } = data;

      Cookies.set("authToken", TokenID, { expires: 7, secure: true });
      Cookies.set("name", FullName, { expires: 7, secure: true });

      message.success("Login successful!");
    } catch (error) {
      // Handle error
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <main className="flex min-h-screen flex-row gap-4 p-4 bg-primary-500 map-background">
      <div className="w-2/5 content-center">
        <div className="flex flex-col gap-y-12 px-44">
          <div className="w-36 h-36 bg-white place-self-center rounded-full justify-center items-center flex">
            <Image
              src="/images/fake-logo.png"
              width={100}
              height={100}
              alt={"logo"}
            />
          </div>

          <div className="flex items-start flex-col gap-y-3">
            <h2 className="text-black font-bold text-4xl">ورود</h2>
            <p className="text-black font-light">
              لطفا وارد حساب کاربری خود شوید و ماجراجویی را شروع کنید
            </p>
          </div>

          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="ایمیل"
              name="UserName"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<Sms variant="Bulk" />}
                placeholder="example@gmail.com"
              />
            </Form.Item>

            <Form.Item
              label="رمزعبور"
              name="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<Lock variant="Bulk" />}
                placeholder="رمزعبور"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>من را به خاطر بسپار</Checkbox>
            </Form.Item>

            <Form.Item>
              <div>
                <Button
                  loading={loading}
                  className="bg-green-400 justify-center text-white hover:bg-green-800 hover:text-primary-foreground border-0"
                  htmlType="submit"
                  block
                >
                  ورود
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="bg-white w-3/5 rounded-3xl flex-col justify-center items-center flex gap-y-4 py-44">
        <h1 className="text-black text-5xl font-black">
          انبــــار داری هوشمند لینـــاری
        </h1>
        <p className="text-black font-light">
          با اجاره انبارهای مدرن ما، امنیت، سرعت و بهره‌وری را به کسب‌وکار خود
          هدیه دهید. و آینده‌تان را تضمین کنید!
        </p>
        <div className="image-container">
          <Image
            src="/images/login-intro.png"
            layout="fill"
            objectFit="contain"
            alt="logo"
          />
        </div>
      </div>
    </main>
  );
};

export default Login;
