// src/pages/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux//slices/AuthSlice";
import RegisterForm from "../components/auth/RegisterForm";
import type { Field } from "../types/ui";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {  session } = useAppSelector((state) => state.auth);

  // Campos adaptados a email/password (Supabase)
  const fields: Field[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  const initialValues = { email: "", password: "" };

  function handleSubmit(values: Record<string, string>) {
    dispatch(
      login({
        email: values.email,
        password: values.password,
      })
    );
  }

  // Redirigir si hay sesión activa (usuario logueado)
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <RegisterForm
      title="Login"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Login"
      rightImageUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/loginImg.jpg"
      logoUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
      bottomText="Don't have an account?"
      bottomLinkLabel="Register"
      onBottomLink={() => navigate("/register")}
    />
  );
}
