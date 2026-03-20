import { createServerFn } from "@tanstack/react-start";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadResumeFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }
    const file = data.get("resume") as File;
    if (!file || !(file instanceof File)) {
      throw new Error("Resume file is required");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }
    return { file };
  })
  .handler(async ({ data }) => {
    const { file } = data;

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const key = `resumes/${crypto.randomUUID()}-${file.name}`;
      const bucketName = "wegotwork";

      const putObject = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await r2.send(putObject);

      return { key };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload resume to R2");
    }
  });
