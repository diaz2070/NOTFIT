import AuthForm from '@/components/auth/AuthForm';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AuthPageProps = Readonly<{
  title: string;
  description: string;
  type: 'sign-in' | 'sign-up';
}>;

function AuthPage({
  title = 'Auth Page',
  description = 'Please sign in or sign up to continue',
  type = 'sign-in',
}: AuthPageProps) {
  return (
    <div className="mt-8 sm:mt-15 px-4 pb-9 xl:px-8 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4 text-center">
          <CardTitle className="text-2xl sm:text-3xl font-[family-name:var(--font-lemon)]">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <AuthForm type={type} />
      </Card>
    </div>
  );
}

export default AuthPage;
