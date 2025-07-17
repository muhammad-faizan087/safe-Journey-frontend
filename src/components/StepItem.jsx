import React from "react";

const StepItem = ({ number, title, description }) => {
  return (
    <div className="relative">
      <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white">
        {number}
      </div>
      <h3 className="pl-6 text-xl font-bold">{title}</h3>
      <p className="mt-2 pl-6 text-muted-foreground">{description}</p>
    </div>
  );
};

export default StepItem;
