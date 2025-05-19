import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:grid-cols-2 md:py-10">
      <div className="flex flex-col items-start gap-2 animate-slide-in-bottom [animation-delay:200ms]">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Welcome to <span className="gradient-text">QuizMaster</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The interactive learning platform that makes studying fun and effective. Create, share, and master quizzes
          with ease.
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Interactive Learning</h3>
              <p className="text-sm text-muted-foreground">Engage with content in multiple formats</p>
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor your improvement over time</p>
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Personalized Content</h3>
              <p className="text-sm text-muted-foreground">Tailored to your learning style</p>
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Collaborative Learning</h3>
              <p className="text-sm text-muted-foreground">Share and learn with peers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 animate-slide-in-bottom [animation-delay:400ms]">
        <div className="space-y-2 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Sign In</h2>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </section>
  )
}
