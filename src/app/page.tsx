import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                VerityLock
            </h1>
            <p className="text-muted-foreground">
                Sign in to your account to continue
            </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
