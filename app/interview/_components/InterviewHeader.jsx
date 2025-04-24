import Image from "next/image";
import React from "react";

function InterviewHeader() {
  return (
    <div className="p-4 shadow-md">
      <Image
        src={"/logo.png"}
        alt="logo"
        width={200}
        height={200}
        className="w-[80px]"
      />
    </div>
  );
}

export default InterviewHeader;
