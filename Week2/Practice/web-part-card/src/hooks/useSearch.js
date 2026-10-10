// useSearch.js

import { useState } from "react";

export const useSearch = (initialData) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    const result = initialData.filter((item) => item.name.includes(search));
    setFilteredData(result);
  };

  return {
    search,
    filteredData,
    handleSearchChange,
    handleSearchClick,
  };
};
