import {
  Brain,
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  LayoutDashboardIcon,
  List,
  Puzzle,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SideBaOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/schedule-interview",
  },
  {
    name: "All Interviews",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Brain,
  },
];

export const QUESTION_PROMPT =
  'You are an expert technical interview. based on the following inputs, generate a well-structured list of high-quality interview questions: Job Title:{{jobTitle}} Job Description:{{jobDescription}} Interview Duration:{{duaration}} Interview Type:{{type}} Your task: Analyze the job description to identify the key responsibilities,required skills,and expected experience. Generate a list of interview questions depends on interview duration Adjust the number and depth of questions to match the interview duration. Ensure the questions match the tone and structure of a real-life {{type}} interview. IMPORTANT - Only return valid JSON and Format your response in JSON format with array list of questions , Format must match this exactly. format:interviewQuestions=[ { question:"", type:"Technical/Behavioral/Experience/Problem Solving/Leadership"},{ ... }] The goal is to create a structured,relevant,and time-optimized interview plan for a {{jobTitle}} role. Important: Return only a valid JSON object. Do not include any text before or after the JSON.';

export const FEEDBACK_PROMPT = `
  {{conversation}}
  Depends on this Interview conversation between assistant and user,Give me feedback for user Interview. Give me Rating out of 10 for technical skills,communication,problem solving,Experience.Also give me summary in 3 lines about the interview and one line to let me know whether is recommanded for hire or not with message.Give me response in JSON format
  {
  feedback:{
  rating:{
  technical skill:5,
  communication:6,
  problemSolving:4,
  experience:7},
  summary:<in 3 lines>,
  Recommandation:",
  RecommandationMsg:"
  }
  }.
  Important: Return only a valid JSON object. Do not include any text before or after the JSON.`;
