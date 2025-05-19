import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function StudentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/alice-portrait.png" alt="Avatar" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Alice Johnson</p>
          <p className="text-sm text-muted-foreground">Completed "JavaScript Basics" • 92%</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">2h ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/thoughtful-man-in-park.png" alt="Avatar" />
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Bob Smith</p>
          <p className="text-sm text-muted-foreground">Started "React Fundamentals"</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">5h ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/person-contemplating.png" alt="Avatar" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Charlie Davis</p>
          <p className="text-sm text-muted-foreground">Completed "CSS Layouts" • 85%</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">1d ago</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/diana-goddess.png" alt="Avatar" />
          <AvatarFallback>DI</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Diana Wilson</p>
          <p className="text-sm text-muted-foreground">Completed "HTML Essentials" • 98%</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">2d ago</div>
      </div>
    </div>
  )
}
