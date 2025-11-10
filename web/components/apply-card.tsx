"use client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { applyToJob } from "@/actions/jobs/apply-to-job";
import { Loader2, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export default function ApplyCard({ jobId }: { jobId: string }) {
  const [name, setName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>();
  const [motivation, setMotivation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file!);
    setLoading(true);
    const res = await applyToJob(
      jobId,
      name!,
      emailAddress!,
      motivation!,
      formData,
    );
    setLoading(false);
    if (res.ok) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  return (
    <>
      <div className="lg:w-1/2 w-full rounded-none bg-theme border border-foreground/20 border-dashed p-7 text-left">
        <form onSubmit={apply} className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-white text-center">
              Apply to job
            </h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              Full name
            </Label>
            <Input
              className="bg-white bg-accent border border-dashed rounded-none text-white font-medium text-base"
              required
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              Email address
            </Label>
            <Input
              className="bg-white bg-accent border border-dashed rounded-none text-white font-medium text-base"
              required
              placeholder="Enter your email address"
              value={emailAddress}
              onChange={(e) => {
                setEmailAddress(e.target.value);
              }}
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-medium">Phone number</Label>
            <Input className="bg-white border border-black rounded-none text-black font-medium text-base" required type="number" placeholder="Enter your phone number" value={phoneNumber ?? ""} onChange={((e) => {setPhoneNumber(Number(e.target.value))})} />
            </div> */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              Resume
            </Label>
            <div>
              <Input
                className="bg-accent file:text-white file:font-medium border border-dashed rounded-none text-white font-medium text-base"
                required
                type="file"
                id="file"
                name="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivation" className="text-white font-medium">
              Cover letter
            </Label>
            <Textarea
              rows={6}
              className="bg-accent border border-dashed rounded-none text-white font-medium text-base"
              required
              value={motivation}
              onChange={(e) => {
                setMotivation(e.target.value);
              }}
              placeholder="Share why you're a great fit."
            />
          </div>
          <div className="!mt-6">
            <Button
              variant={"default"}
              type="submit"
              className="w-full font-medium rounded-none"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
              ) : (
                <></>
              )}
              Apply to Job
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
