"use client"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import { Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue } from "@/components/ui/select"  
import { Job } from "@prisma/client"
import { JobCard } from "./job"
// import { motion } from "framer-motion"
import { formatJobType } from "@/lib/format-job"
import Balancer from "react-wrap-balancer"
 
type WorkspaceWithJobs = Prisma.WorkspaceGetPayload<{
    include: {
        jobs: true
    }
}>

export function ViewWorkspace({ workspace, locations, types } : { workspace:WorkspaceWithJobs, locations: Array<string>, types: Array<string> }) {
    const [ originalJobs, setOriginalJobs ] = useState<Array<Job>>(workspace.jobs);
    const [ jobs, setJobs ] = useState<Array<Job>>(workspace.jobs);
    const [ selectedLocation, setSelectedLocation ] = useState<string>("All");
    const [ selectedEmploymentType, setSelectedEmploymentType ] = useState<string>("All");
    const filterJobs = (location: string, employmentType: string) => {
      let filteredJobs = originalJobs;
      if (location !== "All") {
          filteredJobs = filteredJobs.filter((job) => job.location === location);
      }
      if (employmentType !== "All") {
          filteredJobs = filteredJobs.filter((job) => job.type === employmentType);
      }
      setJobs(filteredJobs);
  };
    return (
    <div className="w-full flex flex-col items-center text-center p-4 space-y-1 overflow-hidden">
    <h1 className="font-medium text-4xl pt-6">{workspace?.name}</h1>
    {
      workspace.description 
      ? 
      <>
      <Balancer>
      <p className="text-muted-foreground max-w-3xl text-sm pt-3 pb-3">{workspace?.description}</p>
      </Balancer>
      </>
      :  <div className="p-3"></div>
    }
    <div className="flex sm:flex-row flex-col gap-4 lg:w-1/2 w-full pt-2 justify-center">
    <div className="w-full">
    <Select
      onValueChange={(loc) => {
      setSelectedLocation(loc); 
      filterJobs(loc, selectedEmploymentType); 
      }}>
        <SelectTrigger aria-label="Select Locations" className="bg-background border-foreground/20 w-full">
        <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent className="bg-background border-foreground/20">
          <SelectGroup>
            <SelectItem key={"All"} value="All">All Locations</SelectItem>
            {
              locations.map((location, index) => {
                return (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                )
              })
            }
          </SelectGroup>
        </SelectContent>
    </Select>
    </div>
    <div className="w-full">
    <Select 
      onValueChange={(type) => {
      setSelectedEmploymentType(type); 
      filterJobs(selectedLocation, type);
    }}>
      <SelectTrigger aria-label="Select Employment" className="bg-background border-foreground/20 w-full">
      <SelectValue placeholder="All Employment" />
      </SelectTrigger>
      <SelectContent className="bg-background border-foreground/20">
        <SelectGroup>
          <SelectItem key={"All"} value="All">All Employment</SelectItem>
          {
              types.map((type, index) => {
                return (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                )
              })
            }
        </SelectGroup>
      </SelectContent>
      </Select>
    </div>
    </div>
    <div className="flex flex-col gap-4 lg:w-1/2 w-full pt-6">
    {jobs.map((job:Job, index) => {
        return (
            <div key={job.id} aria-label="Job">
            <JobCard key={index} job={job}/>
            </div>
        )
    })}
    {
      jobs.length === 0 &&
      <>
      <p className="text-muted-foreground">Nothing to show here.</p>
      </>
    }
    </div>
</div>
    )
}