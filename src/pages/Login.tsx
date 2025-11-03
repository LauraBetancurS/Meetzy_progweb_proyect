import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/slices/AuthSlice";
import RegisterForm from "../components/auth/RegisterForm";
import type { Field } from "../types/ui";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fields: Field[] = [
    { name: "userName", label: "Username", placeholder: "Enter your username", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  ];

  const initialValues = { userName: "", password: "" };

  function handleSubmit(values: Record<string, string>) {
    dispatch(login({ userName: values.userName, password: values.password }));
  }

  // Si hay usuario después de loguear, redirigimos
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
