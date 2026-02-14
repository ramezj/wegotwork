import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const key = Date.now() + file.name;
      const bucketName = "wegotwork";

      const putObject = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
      });

      await r2.send(putObject);

      // Construct the public URL using the R2 Dev domain or your custom domain.
      // Based on typical R2 dev endpoints:
      const logoUrl = `https://pub-42c676678255476d91781297127e9976.r2.dev/${key}`;

      return { url: logoUrl };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload logo to R2");
    }
  });
