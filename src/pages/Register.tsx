// src/pages/Register.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { register } from "../redux/slices/AuthSlice";
import RegisterForm from "../components/auth/RegisterForm";
import type { Field } from "../types/ui";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fields: Field[] = [
    { name: "fullName", label: "Full Name", placeholder: "Enter your full name", required: true },
    { name: "userName", label: "Username", placeholder: "Enter your username", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your mail", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  ];

  const initialValues = { fullName: "", userName: "", email: "", password: "" };

  function handleSubmit(values: Record<string, string>) {
    dispatch(
      register({
        fullName: values.fullName,
        userName: values.userName,
        email: values.email,
        password: values.password,
      })
    );
  }

  // si el registro fue OK y el slice dejó user, podemos mandar al login o al dashboard
  useEffect(() => {
    if (user) {
      // si quieres igual que antes: navigate('/login')
      // pero como ya queda logueado en el slice, puedes mandarla al home:
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <RegisterForm
      title="Register"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Register"
      rightImageUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/registerImg.jpg"
      logoUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
      bottomText="You have an account?"
      bottomLinkLabel="Login"
      onBottomLink={() => navigate("/login")}
    />
  );
}
