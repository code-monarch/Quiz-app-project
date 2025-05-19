import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/javascript-code.png" alt="Avatar" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">JavaScript Basics</p>
          <p className="text-sm text-muted-foreground">Completed • Score: 85%</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">2h ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/react-concept.png" alt="Avatar" />
          <AvatarFallback>RE</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">React Fundamentals</p>
          <p className="text-sm text-muted-foreground">Started • In progress</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">5h ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/cascading-style-sheets.png" alt="Avatar" />
          <AvatarFallback>CSS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">CSS Layouts</p>
          <p className="text-sm text-muted-foreground">Assigned • Not started</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">1d ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/html-code-snippet.png" alt="Avatar" />
          <AvatarFallback>HT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">HTML Essentials</p>
          <p className="text-sm text-muted-foreground">Completed • Score: 92%</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">3d ago</div>
      </div>
    </div>
  )
}
