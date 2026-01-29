// import { Form, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Job } from "generated/prisma/client";
// import { jobSchema } from "@/types/job";
// import {
//   Field,
//   FieldLabel,
//   FieldContent,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldSet,
//   FieldLegend,
// } from "../ui/field";
// import { Controller } from "react-hook-form";
// import { Input } from "../ui/input";

// export function EditJobForm({ job }: { job: Job }) {
//   const form = useForm({
//     defaultValues: {
//       ...job,
//       description: job.description || "",
//       status: job.status || "DRAFT",
//       type: job.type || "FULLTIME",
//       locationMode: job.locationMode || "ONSITE",
//       country: job.country || "",
//       city: job.city || "",
//       address: job.address || "",
//       salaryMin: job.salaryMin || 0,
//       salaryMax: job.salaryMax || 0,
//       currency: job.currency || "USD",
//       salaryInterval: job.salaryInterval || "MONTHLY",
//       experienceLevel: job.experienceLevel || "ENTRY",
//       categoryId: job.categoryId || "",
//     },
//     resolver: zodResolver(jobSchema),
//   });
//   return (
//     <>
//       <form>
//         <Form {...form}>
//           <FieldGroup>
//             <FieldSet>
//               <FieldLegend>Job Details</FieldLegend>
//               <FieldDescription>Edit job information</FieldDescription>
//               <FieldGroup>
//                 <Controller
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <Field>
//                       <FieldLabel>Title</FieldLabel>
//                       <FieldContent>
//                         <Input {...field} />
//                       </FieldContent>
//                       <FieldError />
//                     </Field>
//                   )}
//                 />
//               </FieldGroup>
//             </FieldSet>
//           </FieldGroup>
//         </Form>
//       </form>
//     </>
//   );
// }
