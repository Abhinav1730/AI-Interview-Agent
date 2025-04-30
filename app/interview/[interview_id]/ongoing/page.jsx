"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2Icon, Mic, Phone } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState(null);
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY));

  const router = useRouter();

  useEffect(() => {
    if (interviewInfo) {
      startCall();
    }
  }, [interviewInfo]);

  const startCall = async () => {
    try {
      if (!interviewInfo?.interviewData?.questionList) {
        console.warn("No questions available for the interview.");
        return;
      }

      const questionList = interviewInfo.interviewData.questionList
        .map((item) => item.question)
        .join(", ");

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
              content: `You are an AI voice assistant conducting interviews. Ask the following questions one at a time and respond naturally: Questions: ${questionList} After 5-7 questions, wrap up the interview and summarize performance.`,
            },
          ],
        },
      };

      await vapi.start(assistantOptions);
    } catch (error) {
      console.error("Error starting Vapi call:", error);
      toast.error("Could not start interview.");
    }
  };

  const stopInterview = () => {
    vapi.stop();
    router.push("/interview/completed");
  };

  const GenerateFeedback = async () => {
    setLoading(true);

    if (!conversation) {
      console.warn("No conversation data to generate feedback.");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation,
      });

      const content = result?.data?.content || "";
      const FINAL_CONTENT = content.replace("```json", "").replace("```", "").trim();
      const feedbackJson = JSON.parse(FINAL_CONTENT);

      await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id: interview_id,
          feedback: feedbackJson,
          recommanded: false,
        },
      ]);

      router.replace(`/interview/${interview_id}/completed`);
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
      <h2 className="font-semibold text-xl flex justify-between">AI Interview Session</h2>

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
        {!loading ? (
          <Phone
            className="h-10 w-10 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={stopInterview}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </div>

      <h2 className="text-center font-light my-4">Interview is going ON!</h2>
    </div>
  );
}

export default StartInterview;
