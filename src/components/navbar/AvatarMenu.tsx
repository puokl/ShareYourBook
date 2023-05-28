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
import { useRouter } from "next/router";

type AvatarMenuProps = {};

const AvatarMenu: React.FC<AvatarMenuProps> = () => {
  const { logout, user } = useContext(AuthContext);
  const router = useRouter();

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
              // bg="teal.500"
              name={user ? user?.displayName : ""}
              src={user?.photoURL}
            />
          </MenuButton>
          <MenuList alignItems={"center"}>
            <br />
            <Center>
              <Avatar
                size={"2xl"}
                name={user ? user?.displayName : ""}
                src={user?.photoURL}
              />
            </Center>
            <br />
            <Center>
              <Text fontSize="lg" as="b">
                {user ? user?.displayName : ""}
              </Text>
            </Center>
            <br />
            <MenuDivider />
            <MenuItem
              onClick={() => router.push(`/library/${user?.displayName}`)}
            >
              Your Library
            </MenuItem>

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
