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
import { Separator } from "./ui/separator"
 
type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
        include: {
          categories: {
            include: {
                jobs: true
            }
          },
          jobs: {
            include: {
                category: true
            }
          }
        }
}>

type JobWithCategories = Prisma.JobGetPayload<{
  include: {
    category: true
  }
}>

type CategoryWithJobs = Prisma.JobCategoryGetPayload<{
  include: {
    jobs: true
  }
}>

export function ViewOrganization({ organization, locations, types } : { organization:OrganizationWithJobs, locations: Array<string>, types: Array<string>}) {
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
        <SelectTrigger value={"All Locations"} aria-label="Select Locations" 
        className="bg-white rounded-none border-black border-2 text-black font-bold w-full shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <SelectValue placeholder="All Locations">
          All Locations
        </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-black border-2 rounded-none text-black font-bold mt-1">
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
    
      <SelectTrigger aria-label="Select Employment" 
      className="bg-white rounded-none border-black border-2 text-black font-bold w-full shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <SelectValue placeholder="All Employment" />
      </SelectTrigger>
      <SelectContent className="bg-white border-black border-2 rounded-none text-black font-bold mt-1">
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
    {jobs.filter((job) => job.categoryId === null).map((job:Job, index) => {
        return (
            <motion.div
            key={job.id} aria-label="Job">
            <JobCard key={index} job={job as JobWithCategories}/>
            </motion.div>
        )
    })}
    {
      organization.categories.filter((category) => category.jobs.length > 0).map((category:CategoryWithJobs, index) => {
        return (
          <div className="text-left flex flex-col gap-4" key={category.id}>
          <motion.h1
          className="font-extrabold text-black text-2xl pb-2 pt-2">{category.name}</motion.h1>
          {category.jobs.map((job:Job, index) => {
            return (
            <motion.div
            key={job.id} aria-label="Job">
            <JobCard key={index} job={job as JobWithCategories}/>
            </motion.div>
            )
          })}
          </div>
        )
      })
    }
    {
      jobs.length === 0 &&
      <Card className="bg-white rounded-none border-2 border-black p-8  shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <p className="text-black font-bold">We are currently not hiring.</p>
      </Card>
    }
    </div>
    </div>
    )
}