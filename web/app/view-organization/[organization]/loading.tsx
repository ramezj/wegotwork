import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen items-center flex flex-col justify-center">
        <Loader2 className="size-8 animate-spin text-white" />
      </div>
    </>
  );
}
