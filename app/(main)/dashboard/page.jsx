import React from "react";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewsList from "./_components/LatestInterviewsList";

function Dashboard() {
  return (
    <div>
      {/* <WelcomeContainer /> */}
      <h2 className="my-3 font-semibold text-3xl mt-5">Dashboard</h2>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  );
}

export default Dashboard;
