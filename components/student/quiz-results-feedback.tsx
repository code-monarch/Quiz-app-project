import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function QuizResultsFeedback() {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/instructor.png" alt="Instructor" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="font-medium">Dr. Jane Smith</div>
            <div className="text-xs text-muted-foreground">May 16, 2023</div>
          </div>
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="mb-2">
              Great job on this quiz! You've demonstrated a solid understanding of JavaScript basics, particularly in
              variables, data types, and DOM manipulation.
            </p>
            <p className="mb-2">
              I noticed you had some difficulty with the async JavaScript questions. This is a more advanced topic, so
              don't worry too much. I'd recommend reviewing the section on Promises and async/await in the course
              materials.
            </p>
            <p>Your progress is impressive, and I'm confident you'll continue to improve. Keep up the good work!</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Additional Resources</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <a href="#" className="text-primary hover:underline">
              JavaScript Promises: An In-depth Guide
            </a>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <a href="#" className="text-primary hover:underline">
              Working with Arrays and Objects in JavaScript
            </a>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-primary">•</span>
            <a href="#" className="text-primary hover:underline">
              Advanced DOM Manipulation Techniques
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
