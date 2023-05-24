import React, { useContext } from "react";
import { BookContext } from "@/context/BookContext";
import { Image } from "@chakra-ui/react";

const one: React.FC = () => {
  const { selectedAuthor, setSelectedAuthor } = useContext(BookContext);

  console.log("selectedAuthor", selectedAuthor.key);
  const img = `https://covers.openlibrary.org/a/olid/${selectedAuthor.key}-M.jpg`;
  return (
    <>
      <Image src={img} />
      <div>hello from {selectedAuthor.name}</div>
    </>
  );
};

export default one;
