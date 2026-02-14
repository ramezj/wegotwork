import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";

export const uploadLogoFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    const file = data.get("logo") as File;
    if (!file || !(file instanceof File)) {
      throw new Error("Logo file is required");
    }
    // Optional: Add file size/type validation here
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File size exceeds 2MB limit");
    }
    return { file };
  })
  .handler(async ({ data }) => {
    const { file } = data;
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthenticated");
    }

    console.log("Uploading logo file:", file.name, file.size);

    // TODO: Implement S3 upload here
    // For now, return a placeholder or simulate a successful upload
    const logoUrl = `https://storage.example.com/logos/${Date.now()}-${file.name}`;

    return { url: logoUrl };
  });
