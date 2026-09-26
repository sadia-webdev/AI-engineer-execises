import { inngest } from "./client";

export const userRegistration = inngest.createFunction(
  {
    id: "user-registration",
    triggers: { event: "user/registered" },
  },

  async ({ event, step }) => {
    await step.run("prepare-welcome", async () => {
      console.log("Preparing welcome message for:", event.data.email);

      return {
        message: `Welcome ${event.data.name}!`,
      };
    });

    await step.sleep("wait-before-welcome", "10s");

   const verification = await step.waitForEvent("wait-for-verification", {
     event: "user/verified",
     timeout: "1h",
     match: "data.userId",
   });
    await step.run("complete-registration", async () => {
      console.log("Registration completed for:", event.data.email);

      return {
        userId: event.data.userId,
        status: "verified",
      };
    });

    return {
      success: true,
      verification,
    };
  },
);
