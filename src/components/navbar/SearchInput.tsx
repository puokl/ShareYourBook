import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  VStack,
  useOutsideClick,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { User } from "firebase/auth";
import axios from "axios";
import { BookContext } from "@/context/BookContext";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

type SearchInputProps = {
  user?: User | null;
};

type FetchedDataType = {
  alternate_names: string[];
  birth_date: string;
  death_date: string;
  key: string;
  name: string;
  top_subjects: string[];
  top_work: string;
  type: string;
  work_count: number;
  _version_: number;
};

const SearchInput: React.FC<SearchInputProps> = ({}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [fetchedData, setFetchedData] = useState<FetchedDataType[]>([]);
  const { setSelectedAuthor, selectedAuthor } = useContext(BookContext);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { user } = useContext(AuthContext);
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  useOutsideClick({
    ref: ref,
    handler: () => {
      setIsModalOpen(false);
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://openlibrary.org/search/authors.json?q=${inputValue}`
        );
        setFetchedData(response.data.docs);
      } catch (error) {
        console.log("SearchInput useEffect error", error);
      }
    }
    fetchData();
  }, [inputValue]);

  return (
    <VStack flexGrow={1} width="auto" mr={2} align="center">
      <VStack width={{ base: "300px", md: "600px" }}>
        {user && (
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.400" mb={1} />}
            />
            <Input
              onClick={() => setIsModalOpen(true)}
              value={inputValue}
              onChange={handleChange}
              placeholder="Search a Book by Author"
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
        )}

        {fetchedData.length > 0 && isModalOpen && (
          <Box
            ref={ref}
            ml={2}
            bg="white"
            pl={2}
            borderRadius="md"
            boxShadow="md"
            maxHeight="200px"
            overflowY="auto"
            width="100%"
            zIndex="1"
            position="relative"
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
                  }}
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
export default SearchInput;
