import { render, screen } from '@testing-library/react';
import SignUp from '@/app/sign-up/page';

jest.mock('@/components/auth/AuthForm', () => {
  return function MockedAuthForm() {
    return <div data-testid="auth-form">Mocked AuthForm</div>;
  };
});

describe('SignUp page', () => {
  it('renders title, description, and AuthForm', () => {
    render(<SignUp />);

    expect(screen.getByText(/sign up/i)).toBeInTheDocument();

    expect(
      screen.getByText(/enter your information to create an account with us!/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });
});
