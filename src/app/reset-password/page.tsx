import PasswordResetForm from '@/components/auth/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <PasswordResetForm />
    </div>
  );
}