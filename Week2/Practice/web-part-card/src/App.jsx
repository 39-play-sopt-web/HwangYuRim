import { useState } from "react";

import Card from "./components/Card";
import Header from "./components/Header";
import Search from "./components/Search";

import { members } from "./member";

function App() {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(members);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    const result = members.filter((member) => member.name.includes(search));
    setFilteredMembers(result);
  };

  return (
    <>
      <Header />
      <Search
        search={search}
        onSearchChange={handleSearch}
        onSearchClick={handleSearchClick}
      />
      <section style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            name={member.name}
            github={member.github}
            englishName={member.englishName}
          />
        ))}
      </section>
    </>
  );
}

export default App;
