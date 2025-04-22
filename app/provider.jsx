"use client";

import React, { useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { userDetailContext } from "@/context/UserDetailContext";

// 👇 Hook to use user context
export const useUser = () => {
  const context = useContext(userDetailContext);
  if (!context) {
    throw new Error("useUser must be used within a Provider");
  }
  return context;
};

// 👇 Provider component
function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Try to fetch existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        createOrFetchUser(session.user);
      }
    });

    // ✅ Listen for login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          createOrFetchUser(session.user);
        } else {
          setUser(null); // Clear user on logout
        }
      }
    );

    // ✅ Cleanup listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const createOrFetchUser = async (authUser) => {
    try {
      console.log("Authenticated user:", authUser);

      const { data: existingUsers, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", authUser.email);

      if (fetchError) {
        console.error("Error fetching users:", fetchError);
        return;
      }

      if (!existingUsers || existingUsers.length === 0) {
        const { data: insertedUser, error: insertError } = await supabase
          .from("Users")
          .insert([
            {
              name: authUser.user_metadata?.name,
              email: authUser.email,
              picture: authUser.user_metadata?.picture,
            },
          ])
          .select(); // Ensure we get inserted user back

        if (insertError) {
          console.error("Insert error:", insertError);
          return;
        }

        console.log("Inserted user:", insertedUser);
        setUser(insertedUser?.[0]);
      } else {
        console.log("Fetched user from DB:", existingUsers[0]);
        setUser(existingUsers[0]);
      }
    } catch (err) {
      console.error("Unexpected error in createOrFetchUser:", err);
    }
  };

  return (
    <userDetailContext.Provider value={{ user, setUser }}>
      {children}
    </userDetailContext.Provider>
  );
}

export default Provider;
