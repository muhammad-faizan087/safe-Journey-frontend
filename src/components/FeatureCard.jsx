import React from "react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
        <Icon className="h-6 w-6 text-rose-500" />
      </div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
