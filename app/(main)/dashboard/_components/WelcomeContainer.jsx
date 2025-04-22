"use client";

import { useUser } from "@/app/provider";
import Image from "next/image";
import React from "react";

function WelcomeContainer() {
  const { user } = useUser();
  return (
    <div className="bg-white p-5 rounded-2xl flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">Welcome Back! {user?.name}</h2>
        <h2 className="text-primary">
          AI-Driven Interviews , Easy and Convenient
        </h2>
      </div>
      {user && (
        <Image
          src={user?.picture}
          alt="user avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
    </div>
  );
}

export default WelcomeContainer;
