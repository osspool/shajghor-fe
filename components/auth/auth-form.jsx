import Form from "next/form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ResetPasswordForm } from "./reset-password-form";
import { cn } from "@/lib/utils";

export function AuthForm({
    formType = "login",
    action,
    children,
    defaultEmail = "",
    onValidityChange,
    className,
}) {
    const formComponents = {
        login: LoginForm,
        register: RegisterForm,
        resetpass: ResetPasswordForm,
        forgetpass: ForgotPasswordForm,
    };

    const FormComponent = formComponents[formType];

    if (!FormComponent) {
        return null;
    }

    return (
        <Form 
            action={action} 
            className={cn(
                "animate-in fade-in-50 duration-300",
                className
            )}
        >
            <div className=" relative">
                <FormComponent 
                    defaultEmail={defaultEmail} 
                    onValidityChange={onValidityChange}
                />
            </div>
            
            <div className="mt-2">
                {children}
            </div>
            
            {/* Subtle decorative element */}
            <div className="absolute -z-10 w-32 h-32 rounded-full blur-3xl opacity-10 bg-primary -bottom-10 -right-10" />
        </Form>
    );
}