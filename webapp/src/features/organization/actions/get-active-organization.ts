import { createServerFn } from "@tanstack/react-start";

export const getActiveOrganization = createServerFn().handler(
  async ({ data }) => {
    console.log(
      "This is the data that i have received in the create server fn!",
      data
    );
  }
);
