import { createServerFn } from "@tanstack/react-start";
import { Session } from "../../lib/auth";

export const getActiveOrganization = createServerFn()
  .inputValidator(({ session }: { session: Session }) => {})
  .handler(async ({ data }) => {
    console.log(
      "This is the data that i have received in the create server fn!",
      data
    );
  });
