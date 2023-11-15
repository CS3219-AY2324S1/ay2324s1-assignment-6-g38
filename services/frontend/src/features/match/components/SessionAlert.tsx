"use client";

import { Terminal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { selectAuthData } from "@/features/auth";
import { selectMatchState } from "@/features/match/state/matchSelector";

const SessionAlert = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { hasOngoingSession } = useSelector(selectMatchState);
  const { isLoggedIn } = useSelector(selectAuthData);

  const handleRedirectToSession = () => {
    push("/collab");
  };

  const pathIsNotCollab = pathname !== "/collab";
  const shouldRenderSessionAlert =
    isLoggedIn && pathIsNotCollab && hasOngoingSession;

  if (shouldRenderSessionAlert) {
    return (
      <Alert className="fixed bottom-10 right-10 z-10 w-1/3 max-w-lg">
        <Terminal className="h-4 w-4" />
        <div className="flex items-center justify-between">
          <div>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription className="flex justify-center gap-2">
              <p>You have an ongoing session.</p>
            </AlertDescription>
          </div>
          <div>
            <Button variant="default" onClick={handleRedirectToSession}>
              Return to Session
            </Button>
          </div>
        </div>
      </Alert>
    );
  }
  return null;
};

export default SessionAlert;
