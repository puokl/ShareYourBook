import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Stack,
  VStack,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { User } from "firebase/auth";
import axios from "axios";
import { BookContext } from "@/context/BookContext";
import { useRouter } from "next/router";
import Layout from "../Layout";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [fetchedData, setFetchedData] = useState([]);
  const { setAuthorName, setSelectedAuthor } = useContext(BookContext);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef<RefObject<HTMLElement>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search/authors.json?q=${inputValue}`
        );

        // console.log("fetchedData", response.data.docs);
        setFetchedData(response.data.docs);
        setAuthorName(response.data.docs);
        console.log("fetchedData", response.data.docs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [inputValue]);

  useOutsideClick({
    ref: ref,
    handler: () => {
      setIsModalOpen(false);
    },
  });

  const handleClick = () => {};

  // flexgrow={1} means take up the remaining width of its parent container
  return (
    <VStack flexGrow={1} width="auto" mr={2} align="center">
      <VStack width="600px">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.400" mb={1} />}
          />
          <Input
            onClick={() => setIsModalOpen(true)}
            value={inputValue}
            onChange={handleChange}
            placeholder="Search a Book"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            height="34px"
            bg="gray.50"
          />
        </InputGroup>
        {/* <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        {fetchedData.length > 0: setIsModalOpen(true) ? setIsModalOpen(false)} */}
        {fetchedData.length > 0 && isModalOpen && (
          <Box
            ref={ref}
            mt={2}
            bg="white"
            p={2}
            borderRadius="md"
            boxShadow="md"
            maxHeight="200px"
            overflowY="auto"
            width="600px"
            zIndex="1"
          >
            <List width="auto">
              {fetchedData.map((item, index) => (
                <ListItem
                  cursor="pointer"
                  _hover={{
                    bg: "lightgrey",
                  }}
                  key={index}
                  onClick={() => {
                    router.push(`/author/${item.name}`);
                    setSelectedAuthor(item);
                    console.log("selected item", item.name);
                  }}
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </VStack>

      {/* <Button onClick={() => router.push("/hello")}></Button> */}
    </VStack>
  );
};
export default SearchInput;
