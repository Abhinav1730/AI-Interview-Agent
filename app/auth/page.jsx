"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import React from "react";

function login() {
  {
    /*Used to sign in with google */
  }
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error : ", error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center p-8 rounded-2xl">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={400}
          height={100}
          className="w-[150px]"
        />
      </div>
      <div className="flex flex-col items-center ">
        <Image
          src={"/login.jpg"}
          alt="login"
          width={600}
          height={400}
          className="w-[400px] h-[300px]  rounded-2xl"
        />
      </div>
      <h2 className="text-2xl font-bold text-center mt-5">Welcome to AIvaMI</h2>
      <p className="text-stone-500 text-center">Sign in with Google</p>
      <Button className="mt-7 cursor-pointer" onClick={signInWithGoogle}>
        Login with Google
      </Button>
    </div>
  );
}

export default login;
