"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Loader2, Trash } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Job, Type, Workspace } from "@prisma/client"
import { useState } from "react"
import { EditWorkspace } from "@/actions/workspace/edit-workspace"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectGroup } from "@radix-ui/react-select"
import { EditJob } from "@/actions/jobs/edit-job"
import RichTextEditor from "../text-editor"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export function EditJobCard({ job } : { job: Job}) {
    
    const [ current, setCurrent ] = useState<Job>(job);
    const [ loading, setLoading ] = useState<boolean>(false);
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await EditJob(current);
        toast(JSON.stringify(response?.message))
        setLoading(false);
    }
    const editor = useEditor({
        editorProps: {
          attributes: {
            class:
              "min-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
          },
        },
        extensions: [
          StarterKit.configure({
            orderedList: {
              HTMLAttributes: {
                class: "list-decimal pl-4",
              },
            },
            bulletList: {
              HTMLAttributes: {
                class: "list-disc pl-4",
              },
            },
            heading: {
              HTMLAttributes: {
                class: "text-2xl"
              }
            },
            
          }),
        ],
        content: current.content,
        onUpdate: ({ editor }) => {
          setCurrent((prevJob) => ({...prevJob, content: editor.getHTML()}));
        },
      });
    //   if(!editor) {
    //     return null;
    //   }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Job Information</h1>
        <Button size={"icon"} variant={"destructive"}>
            <Trash className="size-4" />
        </Button>
        </div>
        <div>
        <form className="space-y-4" onSubmit={EditTheJob}>
        <div className="space-y-2">
        <Label>Job Title</Label>
        <Input placeholder="Workspace name" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Job Type</Label>
        <Select defaultValue={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
            <SelectTrigger className="" defaultValue={current.type}>
                <SelectValue defaultValue={current.type}/>
            </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectGroup>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="parttime">Part Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        </div>
        <div className="space-y-2">
        <Label>Job Description</Label>
        <RichTextEditor editor={editor!} />
        <Textarea placeholder="Job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
        </div>
        <div className="gap-2">
        {
            loading
            ? 
            <>
            <Button type="submit" disabled className="">
            <Loader2 className="animate-spin mr-2" />
            Save Changes
            </Button>
            </>
            :
            <>
            <Button type="submit" className="">
            Save Changes
            </Button>
            </>
        }
        </div>
        </form>
        </div>
        </>
    )
}