"use client"
import { useState } from "react"
import { Prisma, Type } from "@prisma/client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Job } from "@prisma/client"
import { JobCard } from "./cards/job"
// import { motion } from "framer-motion"
import { formatJobType } from "@/lib/format-job"
import Balancer from "react-wrap-balancer"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
 
type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
    include: {
        jobs: true
    }
}>

export function ViewOrganization({ organization, locations, types } : { organization:OrganizationWithJobs, locations: Array<string>, types: Array<string> }) {
    const [ originalJobs, setOriginalJobs ] = useState<Array<Job>>(organization.jobs);
    const [ jobs, setJobs ] = useState<Array<Job>>(organization.jobs);
    const [ selectedCountry, setSelectedCountry ] = useState<string>("All");
    const [ selectedEmploymentType, setSelectedEmploymentType ] = useState<string>("All");
    const filterJobs = (location: string, employmentType: string) => {
      let filteredJobs = originalJobs;
      if (location !== "All") {
          filteredJobs = filteredJobs.filter((job) => job.country === location);
      }
      if (employmentType !== "All") {
          filteredJobs = filteredJobs.filter((job) => job.type === employmentType);
      }
      setJobs(filteredJobs);
  };
    return (
    <div className="w-full flex flex-col items-center text-center p-4 space-y-1 overflow-hidden">
    <h1 className="font-extrabold text-black text-4xl pt-6">{organization?.name}</h1>
    {
      organization.description 
      ? 
      <>
      <Balancer>
      <p className="max-w-3xl text-sm pt-3 pb-3 text-black font-bold">{organization?.description}</p>
      </Balancer>
      </>
      :  <div className="p-3"></div>
    }
    <div className="flex sm:flex-row flex-col gap-4 lg:w-1/2 w-full pt-2 justify-center">
    <div className="w-full">
    <Select
      onValueChange={(country) => {
        setSelectedCountry(country); 
      filterJobs(country, selectedEmploymentType); 
      }}>
        <SelectTrigger aria-label="Select Locations" className="bg-white rounded-none border-black text-black font-bold w-full">
        <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent className="bg-white border-black rounded-none text-black font-bold">
          <SelectGroup className="space-y-1">
            <SelectItem className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none" key={"All"} value="All">All Locations</SelectItem>
            {
              locations.map((country, index) => {
                return (
                  <SelectItem key={country} value={country} className="hover:!bg-black rounded-none active:!bg-black focus:!bg-black hover:text-white">{country}</SelectItem>
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
      filterJobs(selectedCountry, type);
    }}> 
    
      <SelectTrigger aria-label="Select Employment" className="bg-white rounded-none border-black text-black font-bold w-full">
      <SelectValue placeholder="All Employment" />
      </SelectTrigger>
      <SelectContent className="bg-white border-black rounded-none text-black font-bold">
        <SelectGroup className='space-y-1'>
          <SelectItem key={"All"} value="All" className="hover:!bg-black rounded-none active:!bg-black focus:!bg-black hover:text-white">All Employment</SelectItem>
          {
              types.map((type, index) => {
                return (
                  <SelectItem key={index} value={type} className="hover:!bg-black rounded-none active:!bg-black focus:!bg-black hover:text-white">{formatJobType(type as Type)}</SelectItem>
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
            <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: index + 0.0001}}
            key={job.id} aria-label="Job">
            <JobCard key={index} job={job}/>
            </motion.div>
        )
    })}
    {
      jobs.length === 0 &&
      <Card className="bg-white rounded-none border border-black p-8">
      <p className="text-black font-bold">We are currently not hiring.</p>
      </Card>
    }
    {/* <Card className="bg-white rounded-none border border-black p-8">
      <p className="text-black font-bold">Signup to receive new job postings.</p>
      <div className='flex sm:flex-row flex-col gap-4 mt-4'>
      <Input className='bg-white rounded-none text-black font-bold text-base border border-black' placeholder="Enter email"></Input>
      <Button className='bg-black hover:bg-black text-white hover:text-white rounded-none font-extrabold'>Get Notified</Button>
      </div>
    </Card> */}
    </div>
    </div>
    )
}