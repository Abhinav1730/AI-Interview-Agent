import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      console.log("Raw AI response:", result.data);

      let content = result.data?.content || "";

      //Remove \boxed{ wrapper
      if (content.includes("\\boxed{")) {
        content = content.split("\\boxed{")[1].replace(/}$/, "").trim();
      }

      //Remove ```json and ``` fences
      content = content
        .replace(/```json/, "")
        .replace(/```/, "")
        .trim();

      //Fix partial JSON like: interviewQuestions=[...] into valid JSON
      if (content.trim().startsWith("interviewQuestions=[")) {
        content = `{${content}}`; // Wrap it as object
      }

      //Try parsing the cleaned string
      let parsed;
      try {
        parsed = JSON.parse(content);
        const questions = parsed?.interviewQuestions;

        if (!Array.isArray(questions)) {
          toast("No valid questions found.");
          console.error(
            "Parsed object missing interviewQuestions array:",
            parsed
          );
        } else {
          setQuestionList(questions);
        }
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    const interview_id = uuidv4();
    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-white/20 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is creating personalised questions based on your job
              position!
            </p>
          </div>
        </div>
      )}
      {questionList?.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}
      <div className="flex justify-end mt-10">
        <Button onClick={() => onFinish()}>Finish</Button>
      </div>
    </div>
  );
}

export default QuestionList;
