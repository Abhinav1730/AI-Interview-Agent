import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  MessageCircle,
  Plus,
  Text,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewLink({ interview_id, formData }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;
  const GetInterviewUrl = () => {
    return url;
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied");
  };
  return (
    <div className="flex flex-col items-center w-full justify-center mt-10">
      <Image
        src={"/check.jpg"}
        alt="check image"
        width={200}
        height={200}
        className="w-[60px] h-[60px] "
      />
      <h2 className="font-bold text-lg mt-4">Your AI interview is Ready!!</h2>
      <p className="mt-3 font-normal">
        Share this link with your respective candidates to start the interview
        process
      </p>

      <div className="w-full p-7 mt-6 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-black/90">INTERVIEW LINK</h2>
          <h2 className="p-1 px-2 text-primary bg-white/55 rounded">
            Valid for 30 days
          </h2>
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <Input defaultValue={GetInterviewUrl()} disabled={true} />
          <Button className="cursor-pointer" onClick={() => onCopyLink()}>
            {" "}
            <Copy /> Copy Link
          </Button>
        </div>
        <hr className="my-5" />
        <div className="flex gap-5">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Clock className="h-4 w-4" /> {formData?.duration}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <List className="h-4 w-4" /> 10 q
          </h2>
          {/* <h2 className="text-sm text-gray-500 flex gap-2 items-center"><Calendar className="h-4 w-4" /> 30 MIN{formData?.duration}</h2> */}
        </div>
      </div>
      <div className="mt-7 bg-white p-5 rounded-lg w-full">
        <h2 className="font-semibold">Share Via Following</h2>
        <div className="flex gap-7 mt-2">
          <Button className="cursor-pointer" variant={"outline"}>
            {" "}
            <Mail /> Email{" "}
          </Button>
          <Button className="cursor-pointer" variant={"outline"}>
            {" "}
            <Text /> Text{" "}
          </Button>
          <Button className="cursor-pointer" variant={"outline"}>
            {" "}
            <MessageCircle /> WhatsApp{" "}
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-5 justify-between mt-7">
        <Link href={"/dashboard"}>
          <Button variant={"outline"} className="cursor-pointer">
            {" "}
            <ArrowLeft /> Back to Dashboard{" "}
          </Button>
        </Link>
        <Link href={"/create-interview"}>
          <Button className="cursor-pointer">
            {" "}
            <Plus /> Create New Interview{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
