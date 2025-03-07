import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardFooter } from "@/components/ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex flex-col h-full bg-white rounded-sm transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="w-10 h-10 flex items-center justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl font-extrabold text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-black font-medium">{description}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Button variant={"default"} className="font-medium bg-black text-white hover:bg-black hover:text-white rounded-sm">
          <Link href={'/'} className="flex items-center gap-2 hover:gap-3 transition-all">
            explore teams <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <FeatureCard
        icon={<Users className='h-6 w-6 text-black' />}
        title="team collaboration"
        description="work together seamlessly with your team. share projects, communicate in real-time, and track progress all in one place."
      />
      <FeatureCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 4H8C7.44772 4 7 4.44772 7 5V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V5C17 4.44772 16.5523 4 16 4Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 17H12.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        title="career pages"
        description="create career pages, post jobs & receive applicants, all in one place."
      />
    </div>
  )
}

