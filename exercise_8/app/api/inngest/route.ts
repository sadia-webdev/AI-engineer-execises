// app/api/inngest/route.ts
import { serve } from "inngest/next";

import { userRegistration } from "../../inngest/functions";
import { inngest } from "@/app/inngest/client";

// We'll add functions here as we create them

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Functions will be added here
    userRegistration,
  ],
});
