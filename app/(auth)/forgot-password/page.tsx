import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:grid-cols-2 md:py-10">
      <div className="flex flex-col items-start gap-2 animate-slide-in-bottom [animation-delay:200ms]">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Forgot Your <span className="gradient-text">Password?</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Don&apos;t worry, it happens to the best of us. Let&apos;s get you back into your account.
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="m2 10 8.5 3.5a2 2 0 0 0 3 0L22 10" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">We&apos;ll send you a link to reset your password</p>
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
              <h3 className="font-medium">Secure Process</h3>
              <p className="text-sm text-muted-foreground">Your account security is our top priority</p>
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
              <h3 className="font-medium">Quick Recovery</h3>
              <p className="text-sm text-muted-foreground">Get back to learning in no time</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md space-y-6 animate-slide-in-bottom [animation-delay:400ms]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  )
}
