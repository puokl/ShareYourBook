import Layout from "@/components/Layout";
import { AuthContext } from "@/context/AuthContext";
import { Flex } from "@chakra-ui/react";
import React, { useContext } from "react";

type registroProps = {};

const registro: React.FC<registroProps> = () => {
  const { logout, login, signUpWithGoogle, signUpWithGithub, register } =
    useContext(AuthContext);

  // console.log(password);
  return (
    <div>
      <Layout>
        <main>
          <h1>Register page</h1>
          {/* <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
          <input
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
          <hr />
          <button onClick={login}>Sign Up</button>
          <hr />
          <button onClick={signUpWithGoogle}>Sign Up with Google</button>
          <hr />
          <button onClick={signUpWithGithub}>Sign Up with Github</button>
          <hr />
          <button onClick={logout}>Logout</button> */}
        </main>
      </Layout>
    </div>
  );
};
export default registro;
