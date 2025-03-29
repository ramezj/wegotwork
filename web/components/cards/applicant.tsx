import { formatDistanceToNow } from "date-fns"
import { Applicant } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Calendar, Mail, FileText, ArrowRight } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export default function ApplicantCard({ applicant } : { applicant:Applicant}) {
  // Format the date to show how long ago the application was submitted
  const formattedDate = formatDistanceToNow(new Date(applicant.createdAt), { addSuffix: true })
  return (
    <Card className="transition-all rounded-none bg-white border border-black">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-extrabold capitalize text-black">{applicant.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-black" />
                <span className='text-black'>applied {formattedDate}</span>
              </div>
            </div>
          </div>
          {/* <Badge variant={"default"} className='bg-white rounded-none text-black hover:bg-white hover:text-black border border-black'>
            {applicant.status}
          </Badge> */}
        </div>
      </CardHeader>
      
      <CardContent>
        {applicant.motivation && (
          <p className="text-black">{applicant.motivation}</p>
        )}
      </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-3 p-4 border-t text-left">
        <div className="flex items-center text-left w-full sm:w-auto">
            <Mail className="h-4 w-4 mr-2 text-black" />
            <a href={`mailto:${applicant.email}`} className="text-black hover:text-black hover:underline break-all">
            {applicant.email}
            </a>
        </div>

        {applicant.resumeKey && (
            <Button
            variant="ghost" 
            size="sm" 
            className="rounded-none bg-black hover:bg-black text-white hover:text-white w-full sm:w-auto"
            >
            <FileText className="h-4 w-4 mr-1.5 text-white" />
            Resume
            </Button>
        )}
        </CardFooter>
    </Card>
  )
}

