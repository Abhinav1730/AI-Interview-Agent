import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";
import { userDetailContext } from "@/context/UserDetailContext";

function provider({ children }) {
  const [user, setUser] = useState();
  useEffect(() => {
    createNewUser();
  }, []);
  const createNewUser = () => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      //check if user already exists
      let { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user?.email);

      console.log(Users);

      //if not then create new user
      if (Users?.length == 0) {
        const { data, error } = await supabase.from("Users").insert([
          {
            name: user?.user_metadata?.name,
            email: user?.email,
            picture: user?.user_metadata?.picture,
          },
        ]);
        console.log(data);
        setUser(data);
        return;
      }
      setUser(Users);
    });
  };
  return (
    <userDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </userDetailContext.Provider>
  );
}

export default provider;

export const useUser = () => {
  const context = useContext(userDetailContext);
  return context;
};
