import React from "react";
import { CheckCircle } from "lucide-react";

const SafetyFeature = ({ title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
        <CheckCircle className="h-5 w-5 text-rose-500" />
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default SafetyFeature;
