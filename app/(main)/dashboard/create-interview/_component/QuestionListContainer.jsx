import React from "react";

function QuestionListContainer({ questionList }) {
  return (
    <div>
      <h2 className="font-bold text-lg mb-5">Generated Interview Questions</h2>
      <div className="p-5 border border-primary rounded-xl bg-white">
        {questionList.map((item, index) => (
          <div
            key={index}
            className="p-3 border border-gray-100 rounded-xl mb-3"
          >
            <h2 className="font-normal">{item.question}</h2>
            <h2 className="text-xs font-sans text-primary/70">
              Type - {item.type}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionListContainer;
