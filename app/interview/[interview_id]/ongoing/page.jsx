"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);

  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

  const [activeUser, setActiveUser] = useState(false);

  useEffect(() => {
    startCall();
  }, [interviewInfo]);

  //starting the vapi call
  const startCall = async () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach(
      (item, index) => (questionList = item?.question + "," + questionList)
    );
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview for " +
        interviewInfo?.interviewData?.jobPosition,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              `You are an AI voice assistant conducting interviews. Your job is to ask candidates provided interview questions,assess their responses.Begin the conversation with a friendly introduction , setting a relaxed yet proffesional tone. Example:"Hey there! Welcome to your ` +
              interviewInfo?.interviewData?.jobPosition +
              ` interview. Let's get started with a few questions!" Ask one question at a time and wait for the candidate's response before proceeding.Keep the questions clear and concise.Below are the question asked one by one:
              Questions:` +
              questionList +
              `
              If the candidate struggles ,offer hints or rephrase the questions without giving the answer. Example:
              "Need a hint? Think about how React tracks component updates!"
              Provide brief , encouraging feedback after each answer. Example:
              "Nice! That's a solid answer."
              "Hmm,not quite ! Want to try again?"
              Keep the conversation natural and engaging-use casual phrases like "Alright,next up..." or "Lets tackle a tricky one!"
              After 5-7 questions,wrap up the interview smoothly by summarizing their performance.Example:
              "That was great! You handeled some tough questions really well,Keep shining your skills!"
              End on a positive note:
              "Thanks for Chatting!Hope to see you crushing projects soon!"
              Key Guidelines:
              Be friendly,engaging and witty
              Keep responses short and natural,like a real conversation
              Adapt based on the candidate's confidence level
              Ensure the interview remains focused on ` +
              interviewInfo?.interviewData?.jobPosition +
              `
              `,
          },
        ],
      },
    };

    try {
      await vapi.start(assistantOptions);
    } catch (error) {
      console.error("Error starting Vapi call:", error);
    }
  };

  //to stop interview on clicking cut option and navigate to somewhere else
  const stopInterview = () => {
    vapi.stop();
  };

  vapi.on("call-start", () => {
    console.log("Call has started.");
    toast("Call Connected...");
  });

  vapi.on("speech-start", () => {
    console.log("Assistant speech has started.");
    setActiveUser(false);
  });

  vapi.on("speech-end", () => {
    console.log("Assistant speech has ended.");
    setActiveUser(true);
  });

  vapi.on("call-end", () => {
    console.log("Call has ended.");
    toast("Interview Ended");
  });

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
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
            )}
            <Image
              src={"/ai.jpg"}
              alt="Ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary h-[50px] w-[50px] text-white p-3 rounded-full px-5">
              {interviewInfo?.userName[0]}
            </h2>
            <h2>{interviewInfo?.userName}</h2>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-10 w-10 p-3 bg-gray-400 rounded-full cursor-pointer" />
        <AlertConfirmation stopInterview={() => stopInterview()}>
          <Phone className="h-10 w-10 p-3 bg-red-500 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
      </div>
      <h2 className="text-center font-light my-4">Interview is going ON!</h2>
    </div>
  );
}

export default StartInterview;
