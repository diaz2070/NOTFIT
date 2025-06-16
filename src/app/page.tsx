import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  Users,
  Star,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Custom Routines',
      description:
        'Create personalized workout routines tailored to your goals and schedule.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Monitor your improvements with detailed analytics and visual progress charts.',
    },
    {
      icon: Dumbbell,
      title: 'Exercise Library',
      description:
        'Access a comprehensive database of exercises with instructions and photo demonstrations.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description:
        'Connect with like-minded fitness enthusiasts and share your journey.',
    },
    {
      icon: Star,
      title: 'Goal Mindset',
      description: 'Helps you stay on track with your personal fitness goals.',
    },
    {
      icon: Check,
      title: 'Easy Logging',
      description:
        "Quick and intuitive workout logging that doesn't interrupt your flow.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="flex justify-center items-center py-20 px-4 h-[90dvh]">
        <div className="container mx-auto text-center">
          <div className="flex-1 flex flex-col max-w-4xl mx-auto items-center">
            <Image
              src="/logo-dark.svg"
              alt="Fitness Hero Image"
              width={600}
              height={400}
              className="block dark:hidden w-50 h-auto sm:w-70 sm:h-auto md:w-100 md:h-auto object-fit"
            />
            <Image
              src="/logo-light.svg"
              alt="Fitness Hero Image"
              width={600}
              height={400}
              className="block dark:hidden w-50 h-auto sm:w-70 sm:h-auto md:w-100 md:h-auto object-fit"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-[family-name:var(--font-lemon)]">
              Track Your Fitness Journey Like{' '}
              <span className="text-primary dark:text-[#6d19eb]">
                Never Before
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              NOTFIT helps you create custom workout routines, track your
              progress, and achieve your fitness goals with precision and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link href="/sign-up">Start Your Journey</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 px-4 bg-gray-200 dark:bg-gray-800"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help you stay motivated and track
              your progress effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-900 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#6d19eb] dark:bg-indigo-800">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of users who have already started tracking their
              progress with NOTFIT.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8 py-3"
            >
              <Link href="/sign-up">
                Start Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center md:gap-2">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <div className="bg-primary p-2 rounded-lg">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">NOTFIT:</span>
            </div>
            <p className="text-gray-400 text-center">
              Track your fitness journey like never before with our
              comprehensive workout tracking platform.
            </p>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NOTFIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
