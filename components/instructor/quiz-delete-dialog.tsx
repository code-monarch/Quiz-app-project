"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { deleteQuiz } from "@/lib/quiz-service"
import { useToast } from "@/components/ui/use-toast"

interface QuizDeleteDialogProps {
  quizId: string
  quizTitle: string
}

export function QuizDeleteDialog({ quizId, quizTitle }: QuizDeleteDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmation !== quizTitle) {
      toast({
        title: "Confirmation failed",
        description: "Please type the quiz title correctly to confirm deletion.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeleting(true)
      await deleteQuiz(quizId)
      setOpen(false)
      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted.",
      })
      router.push("/instructor/quizzes")
    } catch (error) {
      console.error("Error deleting quiz:", error)
      // More specific error message based on the error
      const errorMessage = error instanceof Error ? error.message : "Failed to delete the quiz. Please try again."

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Quiz</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the quiz and all associated questions, responses,
            and analytics data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="confirmation" className="text-destructive">
              Type <span className="font-bold">{quizTitle}</span> to confirm deletion
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="border-destructive"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || confirmation !== quizTitle}>
            {isDeleting ? "Deleting..." : "Delete Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
