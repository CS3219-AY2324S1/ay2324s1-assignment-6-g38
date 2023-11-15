import React from "react";

import { OnboardingForm } from "@/features/users";

const page = () => (
  <div className="flex flex-col items-center">
    <h1 className="mb-6 text-2xl">Onboarding</h1>
    <OnboardingForm />
  </div>
);

export default page;
