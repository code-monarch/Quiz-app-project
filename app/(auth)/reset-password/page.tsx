import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:grid-cols-2 md:py-10">
      <div className="flex flex-col items-start gap-2 animate-slide-in-bottom [animation-delay:200ms]">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Reset Your <span className="gradient-text">Password</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Create a new password for your account to keep your learning journey secure.
        </p>
        <div className="mt-6 space-y-4">
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Strong Password</h3>
              <p className="text-sm text-muted-foreground">Create a secure password with our strength indicator</p>
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
              <h3 className="font-medium">Account Security</h3>
              <p className="text-sm text-muted-foreground">Your account will be protected with your new password</p>
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
                <path d="M12 22v-5" />
                <path d="M9 8V2" />
                <path d="M15 8V2" />
                <path d="M12 8v8" />
                <path d="M19 8a7 7 0 1 0-14 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Immediate Access</h3>
              <p className="text-sm text-muted-foreground">Sign in with your new password right away</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 animate-slide-in-bottom [animation-delay:400ms]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </section>
  )
}
