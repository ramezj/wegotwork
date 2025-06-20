"use client"
import { useState } from "react"
import { Prisma, Type } from "@prisma/client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Job } from "@prisma/client"
import { JobCard } from "@/components/cards/job"
// import { motion } from "framer-motion"
import { formatJobType } from "@/lib/format-job"
import Balancer from "react-wrap-balancer"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export function ViewJobs2({ organization, locations, types } : { organization:OrganizationWithJobs, locations: Array<string>, types: Array<string>}) {
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
    <h1 className="font-medium text-white text-4xl pt-6">{organization?.name}</h1>
    {
      organization.description 
      ? 
      <>
      <Balancer>
      <p className="max-w-3xl text-sm pt-3 pb-3 text-white font-bold">{organization?.description}</p>
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
      }}
      defaultValue="All">
        <SelectTrigger value={selectedCountry} aria-label="Select Locations" 
        className="bg-theme text-white border-white/20 border font-medium w-full rounded-none">
        <SelectValue placeholder="All Locations">
          {selectedCountry === "All" ? "All Locations" : selectedCountry}
        </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-theme border-white/20 border rounded-none text-white font-bold mt-1">
          <SelectGroup className="space-y-1">
            <SelectItem className="rounded-none" key={"All"} value="All">All Locations</SelectItem>
            {
              locations.map((country, index) => {
                return (
                  <SelectItem className="rounded-none" key={country} value={country}>{country}</SelectItem>
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
    }}
    defaultValue="All"> 
      <SelectTrigger value={selectedEmploymentType} aria-label="Select Employment" 
      className="bg-[#0A0A0A] text-white border-white/20 border font-medium w-full rounded-none">
      <SelectValue placeholder="All Employment">
        {selectedEmploymentType === "All" ? "All Employment" : formatJobType(selectedEmploymentType as Type)}
      </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-theme border-white/20 border rounded-none text-white font-bold mt-1">
        <SelectGroup className='space-y-1'>
          <SelectItem className="rounded-none" key={"All"} value="All">All Employment</SelectItem>
          {
              types.map((type, index) => {
                return (
                  <SelectItem className="rounded-none" key={index} value={type}>{formatJobType(type as Type)}</SelectItem>
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
          className="font-medium text-white text-2xl pb-2 pt-2">{category.name}</motion.h1>
          {category.jobs.map((job:Job, index) => {
            return (
            <motion.div key={job.id} aria-label="Job">
              <div className="flex items-center justify-between border-b py-4 cursor-pointer">
                <a href={`/view/${organization.slug}/${job.id}`} className="font-semibold hover:underline">
                  {job.title}
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="pointer-events-none rounded-none"
                >
                  {formatJobType(job.type)}
                </Button>
              </div>
            </motion.div>
            )
          })}
          </div>
        )
      }) 
    }
    {
      jobs.length === 0 &&
      <Card className="bg-theme border rounded-none border-white/20 p-8">
      <p className="text-white font-bold">We are currently not hiring</p>
      </Card>
    }
    </div>
    </div>
    )
}