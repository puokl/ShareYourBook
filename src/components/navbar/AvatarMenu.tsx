import {
  Flex,
  Stack,
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AvatarModal from "../modal/AvatarModal";
import { TbLogout } from "react-icons/tb";
type AvatarMenuProps = {};

const AvatarMenu: React.FC<AvatarMenuProps> = () => {
  const { logout, username } = useContext(AuthContext);

  return (
    <Flex alignItems={"center"}>
      <Stack direction={"row"} spacing={7}>
        {/* <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button> */}

        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
            minW={0}
          >
            <Avatar
              size={"sm"}
              bg="teal.500"
              name={username}
              src={"https://bit.ly/broken-link"}
            />
          </MenuButton>
          <MenuList alignItems={"center"}>
            <br />
            <Center>
              <Avatar
                size={"2xl"}
                name={username}
                src="https://bit.ly/broken-link"
              />
            </Center>
            <br />
            <Center>
              <Text>{username}</Text>
            </Center>
            <br />
            <MenuDivider />
            <MenuItem>Your Library</MenuItem>

            <AvatarModal />

            <MenuItem onClick={logout}>
              <TbLogout style={{ marginRight: "15px" }} /> Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </Flex>
  );
};
export default AvatarMenu;
