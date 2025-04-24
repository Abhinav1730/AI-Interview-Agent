"use client";

import React from "react";
import Image from "next/image";
import { Clock, Info, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

function Interview() {
  const { interview_id } = useParams();
  //console.log(interview_id)
  const GetInterviewDetails = () => {};
  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-80 mt-7 ">
      <div className="flex flex-col items-center justify-center border rounded-xl bg-white p-7 lg:px-33  xl:px-52">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={200}
          className="w-[70px]"
        />
        <h2 className="mt-3 font-extrabold text-xl">
          AI-Powered Interview Platform
        </h2>
        <Image
          src={"/interview.jpg"}
          alt="interview image"
          width={500}
          height={500}
          className="w-[320px] my-6"
        />
        <h2 className="font-semibold text-lg">
          Full Stack Developer Interview
        </h2>
        <h2 className="flex gap-2 items-center text-gray-500">
          <Clock className="h-4 w-4 mt-3" /> 30 Minutes
        </h2>

        <div className="w-full">
          <h2>Enter your Full Name</h2>
          <Input placeholder="e.g. Abhinav Saxena" />
        </div>

        <div>
          <div className="bg-white flex gap-4 rounded-3xl border border-primary p-3 mt-10">
            <Info className="text-primary" />
            <h2 className="font-bold">Before you Begin</h2>
            <ul>
              <li className="text-sm text-black">
                Test your Camera and Microphone before to avoid any problem.
              </li>
              <li className="text-sm text-black">
                Ensure you have stable internet connection.
              </li>
              <li className="text-sm text-black">
                Find a quiet place for interview.
              </li>
            </ul>
          </div>
        </div>

        <Button className="mt-5 w-full font-bold rounded-4xl">
          {" "}
          <Video /> Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
