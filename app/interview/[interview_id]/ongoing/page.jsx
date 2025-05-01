"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { LoaderIcon, Mic, Phone } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import AlertConfirmation from "./_components/AlertConfirmation";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (interviewInfo) {
      interviewInfo && startCall();
    }
  }, [interviewInfo]);

  const startCall = async () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach(
      (item, index) => (questionList = item?.question + "," + questionList)
    );

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview for ${interviewInfo?.interviewData?.jobPosition}?`,
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
              `You are an AI voice assistant conducting interviews. Your job is to ask candidates provided interview questions , assess their responses. Begin the conversation with a friendly introduction,setting a relaxed yet professional tone. "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview.Let's get started with a few questions". Ask one question at a time and wait for the candidate's response before proceeding.Keep the flow of questions randomly frm Questions:${questionList} If the candidate struggles , offer hints or rephrase the questions without giving away the answers in such a way that "Need a hint? " Provide brief , encouraging feedback after each answer. Example:"Nice! That's a solid answer." "Hmm , not quite! Want to try again?" Keep the conversation natural and engaging use casual phrases like "Alright , next up..." or "Keep going , you are doing great" After 5-7 questions , wrap up the interview smoothly by summarizing their performance.Example :"That was great! You handled some tough questions well.Keep sharpening your skills!" End on a positive note:"Thanks for chatting!Hope to see you crushing projects soon!" Key Guidlines: Be friendly,engaging and witty 
            . Keep responses short and natural , like a real conversation . Ensure the interview remain focused on ${interviewInfo?.interviewData?.jobPosition}`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = () => {
    vapi.stop();
    router.push("/create-interview");
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
    GenerateFeedback();
  });

  vapi.on("message", (message) => {
    console.log(message?.conversation);
    setConversation(message?.conversation);
  });

  const GenerateFeedback = async () => {
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation,
      });

      const content = result.data.content || "";
      const FINAL_CONTENT = content
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const feedbackJson = JSON.parse(FINAL_CONTENT);

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: feedbackJson,
            recommanded: false,
          },
        ])
        .select();
      console.log(data);

      router.replace('/interview'+interview_id+'/completed');
    } catch (error) {
      console.error("Feedback generation error:", error);
      toast.error("Error generating or saving feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (message) => {
      if (message?.conversation) {
        setConversation(message.conversation);
      }
    };

    const handleCallStart = () => {
      console.log("Call has started.");
      toast("Call Connected...");
    };

    const handleSpeechStart = () => {
      console.log("Assistant speech started.");
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      console.log("Assistant speech ended.");
      setActiveUser(true);
    };

    const handleCallEnd = () => {
      console.log("Call has ended.");
      toast("Interview Ended");

      if (conversation) {
        GenerateFeedback();
      }
    };

    vapi.on("message", handleMessage);
    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);

    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
    };
  }, [conversation, vapi]);

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-semibold text-xl flex justify-between">
        AI Interview Session
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
            )}
            <Image
              src={"/ai.jpg"}
              alt="AI"
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
            <h2 className="text-2xl bg-primary h-[50px] w-[50px] text-center text-white p-2 rounded-full px-5">
              {interviewInfo?.userName?.[0]?.toUpperCase()}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-10 w-10 p-3 bg-gray-400 rounded-full cursor-pointer" />
        {/* <AlertConfirmation stopInterview={() => stopInterview()}> */}
          {!loading ? <Phone
            className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={() => stopInterview()}
          />:<LoaderIcon className="animate-spin"/>}
        {/* </AlertConfirmation> */}
      </div>

      <h2 className="text-center font-light my-4">Interview is going ON!</h2>
    </div>
  );
}

export default StartInterview;
