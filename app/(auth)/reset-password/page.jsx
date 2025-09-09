// ResetPage.jsx
import AuthContainer from "@/components/auth/auth-container";
import ResetPasswordClient from "./reset-password-client";
import { KeyRound } from "lucide-react";

export default async function ResetPage(props) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  return (
    <AuthContainer
      title="Reset Your Password"
      description="Enter your new password below to regain access to your account."
      icon={<KeyRound className="w-6 h-6 text-retro-primary" />}
    >
      <ResetPasswordClient token={token} />
    </AuthContainer>
  );
}
