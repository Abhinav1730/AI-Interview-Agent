import { Phone, Video } from "lucide-react";
import React from "react";

function CreateOptions() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-white border border-primary rounded-lg p-5">
        {/*Video Screening */}
        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className="font-semibold">Create New Interview</h2>
        <p className="text-primary/80">
          Create AI Driven Video interviews and schedule them with candidates
        </p>
      </div>

      <div>
        <div className="bg-white border border-primary rounded-lg p-5">
          {/*Phone Screening */}
          <Phone className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
          <h2 className="font-semibold">Create Phone Screening Call</h2>
          <p className="text-primary/80">
            Create AI Driven Call Interviews and schedule them with candidates
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateOptions;
