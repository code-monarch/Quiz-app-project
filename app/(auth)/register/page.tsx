import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:grid-cols-2 md:py-10">
      <div className="flex flex-col items-start gap-2 animate-slide-in-bottom [animation-delay:200ms]">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Join <span className="gradient-text">QuizMaster</span> Today
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Create an account to start your learning journey or to create engaging quizzes for your students.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">For Students</h3>
              <p className="text-sm text-muted-foreground">Access quizzes and track your progress</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">For Instructors</h3>
              <p className="text-sm text-muted-foreground">Create and manage quizzes for your students</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Comprehensive Library</h3>
              <p className="text-sm text-muted-foreground">Access thousands of ready-made quizzes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Secure Platform</h3>
              <p className="text-sm text-muted-foreground">Your data is always protected</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 animate-slide-in-bottom [animation-delay:400ms]">
        <div className="space-y-2 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Create an Account</h2>
          <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <RegisterForm />
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </section>
  )
}
