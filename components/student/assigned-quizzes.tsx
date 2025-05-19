import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AssignedQuizzes() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-medium">JavaScript Basics</div>
          <div className="text-sm text-muted-foreground">15 questions • 30 minutes</div>
        </div>
        <Badge variant="destructive">Due Tomorrow</Badge>
      </div>
      <div className="flex justify-end">
        <Button size="sm">Start Quiz</Button>
      </div>
      <hr className="my-4" />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-medium">React Fundamentals</div>
          <div className="text-sm text-muted-foreground">20 questions • 45 minutes</div>
        </div>
        <Badge variant="secondary">Due in 3 days</Badge>
      </div>
      <div className="flex justify-end">
        <Button size="sm">Start Quiz</Button>
      </div>
      <hr className="my-4" />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-medium">CSS Layouts</div>
          <div className="text-sm text-muted-foreground">12 questions • 25 minutes</div>
        </div>
        <Badge variant="secondary">Due in 5 days</Badge>
      </div>
      <div className="flex justify-end">
        <Button size="sm">Start Quiz</Button>
      </div>
    </div>
  )
}
