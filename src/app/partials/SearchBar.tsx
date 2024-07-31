"use client"

import { AutoComplete, Input } from "antd";
import React, { useState } from "react";

import { SearchNormal } from "iconsax-react";
import type { SelectProps } from "antd/es/select";

const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const SearchBox = () => {
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const handleSearch = (value: string) => {
    if (!value) {
      setOptions([]);
      return false;
    }
  };

  const onSelect = (value: string) => {
    // router.push(`/crs/reservation/${value}`);
  };

  return (
    <AutoComplete
      style={{ width: "100%" }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      size="large"
      className="main-search"
    >
      <Input.Search
        allowClear
        size="large"
        placeholder={"Search"}
        className="rounded-full placeholder:font-light placeholder:text-xs bg-background ps-2"
        enterButton={
          <SearchNormal variant="Bulk" className="text-zinc-800" size={24} />
        }
      />
    </AutoComplete>
  );
};

export default SearchBox;
