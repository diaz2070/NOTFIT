import AuthForm from '@/components/auth/AuthForm';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignUp() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4 text-center">
          <CardTitle className="text-3xl font-[family-name:var(--font-lemon)]">
            Sign Up
          </CardTitle>
          <CardDescription>
            Enter your email below to sign in into your gym
          </CardDescription>
        </CardHeader>
        <AuthForm />
      </Card>
    </div>
  );
}
