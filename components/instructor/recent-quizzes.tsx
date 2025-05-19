import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentQuizzes() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/javascript-code.png" alt="Avatar" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">JavaScript Basics</p>
          <p className="text-sm text-muted-foreground">Created 2 days ago • 15 questions</p>
        </div>
        <div className="ml-auto font-medium">12 attempts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/react-concept.png" alt="Avatar" />
          <AvatarFallback>RE</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">React Fundamentals</p>
          <p className="text-sm text-muted-foreground">Created 5 days ago • 20 questions</p>
        </div>
        <div className="ml-auto font-medium">8 attempts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/cascading-style-sheets.png" alt="Avatar" />
          <AvatarFallback>CSS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">CSS Layouts</p>
          <p className="text-sm text-muted-foreground">Created 1 week ago • 12 questions</p>
        </div>
        <div className="ml-auto font-medium">24 attempts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/html-code-snippet.png" alt="Avatar" />
          <AvatarFallback>HT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">HTML Essentials</p>
          <p className="text-sm text-muted-foreground">Created 2 weeks ago • 10 questions</p>
        </div>
        <div className="ml-auto font-medium">32 attempts</div>
      </div>
    </div>
  )
}
