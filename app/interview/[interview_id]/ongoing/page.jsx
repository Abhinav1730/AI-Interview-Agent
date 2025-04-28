"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-semibold text-xl flex justify-between">
        AI Interview Session{" "}
        <span className="flex gap-2 items-center">
          <Timer /> 00:00:00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <Image
            src={"/ai.jpg"}
            alt="Ai"
            width={100}
            height={100}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <h2>AI Recruiter</h2>
        </div>
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">{interviewInfo?.userName[0]}</h2>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-10 w-10 p-3 bg-gray-400 rounded-full cursor-pointer"/>
        <Phone className="h-10 w-10 p-3 bg-red-500 text-white rounded-full cursor-pointer"/>
      </div>
      <h2 className="text-center font-light my-4">Interview is going ON!</h2>
    </div>
  );
}

export default StartInterview;
