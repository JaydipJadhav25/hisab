import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/api/generated/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await login.mutateAsync(values);
      navigate("/dashboard");
    } catch {
      // error surfaced below via login.error
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{t("auth.welcomeBack")}</h1>
      <p className="mt-1 text-sm text-ink-muted">Log in to manage today's tiffin.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label={t("auth.password")}
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {login.isError && (
          <p className="text-sm text-danger">
            {(login.error as any)?.friendlyMessage ?? "Invalid email or password."}
          </p>
        )}
        <Button type="submit" isLoading={login.isPending} className="mt-2">
          {t("auth.login")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          {t("auth.register")}
        </Link>
      </p>
    </div>
  );
}
