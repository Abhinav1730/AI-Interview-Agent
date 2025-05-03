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

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [callEnd, setCallEnd] = useState(false);
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (interviewInfo) {
      console.log("Interview Info detected. Starting call...");
      startCall();
    }
  }, [interviewInfo]);

  const startCall = async () => {
    console.log("Attempting to start call...");
    
    // TEMP: basic assistant config for debugging
    const assistantOptions = {
      assistant: {
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US"
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant."
            }
          ]
        },
        firstMessage: `Hi ${interviewInfo?.userName}, ready for your ${interviewInfo?.interviewData?.jobPosition} interview?`
      }
    };
    

    console.log("Assistant Options:", assistantOptions);

    try {
      const call = await vapi.start(assistantOptions);
      if (!call) {
        console.error("❌ Failed to start call: returned null");
        toast.error("Interview could not start. Please check your API key or config.");
        return;
      }
      console.log("✅ Call started successfully:", call);
    } catch (err) {
      console.error("❌ Error while starting call:", err);
      toast.error("Failed to start call. Check your configuration and API key.");
    }
  };

  const stopInterview = () => {
    vapi.stop();
    setCallEnd(true);
    GenerateFeedback();
  };

  vapi.on("call-start", () => {
    console.log("📞 Call has started.");
    toast.success("Call Connected...");
  });

  vapi.on("speech-start", () => {
    console.log("🗣️ Assistant speech started.");
    setActiveUser(false);
  });

  vapi.on("speech-end", () => {
    console.log("🎤 Assistant speech ended.");
    setActiveUser(true);
  });

  vapi.on("call-end", () => {
    console.log("📴 Call has ended.");
    toast("Interview Ended");
    GenerateFeedback();
  });

  vapi.on("error", (err) => {
    console.error("🚨 Vapi runtime error:", err);
    toast.error("A runtime error occurred during the interview.");
  });

  vapi.on("message", (message) => {
    try {
      const json = JSON.parse(message);
      setConversation(json);
    } catch (err) {
      console.log("Failed to parse conversation message:", err);
    }
  });

  const GenerateFeedback = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation,
      });

      const content = result.data.content || "";
      const parsed = content.replace("```json", "").replace("```", "").trim();
      const feedbackJson = JSON.parse(parsed);

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

      console.log("✅ Feedback saved:", data);
      router.replace("/interview/" + interview_id + "/completed");
    } catch (error) {
      console.error("❌ Feedback generation error:", error);
      toast.error("Failed to generate or save feedback.");
    } finally {
      setLoading(false);
    }
  };

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
        {!loading ? (
          <Phone
            className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={stopInterview}
          />
        ) : (
          <LoaderIcon className="animate-spin" />
        )}
      </div>

      <h2 className="text-center font-light my-4">Interview is going ON!</h2>
    </div>
  );
}

export default StartInterview;
