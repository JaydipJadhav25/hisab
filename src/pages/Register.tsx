import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/api/generated/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await registerUser.mutateAsync(values);
      navigate("/dashboard");
    } catch {
      // error surfaced below via registerUser.error
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{t("auth.createAccount")}</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage your daily tiffin in under 10 seconds.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input label={t("auth.name")} error={errors.name?.message} {...register("name")} />
        <Input
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input label={t("auth.phone")} type="tel" error={errors.phone?.message} {...register("phone")} />
        <Input
          label={t("auth.password")}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {registerUser.isError && (
          <p className="text-sm text-danger">
            {(registerUser.error as any)?.friendlyMessage ?? "Could not create your account."}
          </p>
        )}
        <Button type="submit" isLoading={registerUser.isPending} className="mt-2">
          {t("auth.register")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t("auth.login")}
        </Link>
      </p>
    </div>
  );
}
