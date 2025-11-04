// src/pages/Register.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { register } from "../redux/slices/AuthSlice";
import RegisterForm from "../components/auth/RegisterForm";
import type { Field } from "../types/ui";
import { supabase } from "../services/supabaseClient";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { session, isLoading } = useAppSelector((state) => state.auth);

  // 👇 Form fields
  const fields: Field[] = [
    { name: "fullName", label: "Full Name", placeholder: "Enter your full name", required: true },
    { name: "userName", label: "Username", placeholder: "Enter your username", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
    // ✅ Optional avatar URL input
    { name: "avatarUrl", label: "Avatar URL (optional)", placeholder: "https://example.com/avatar.jpg", required: false },
  ];

  const initialValues = {
    fullName: "",
    userName: "",
    email: "",
    password: "",
    avatarUrl: "",
  };

  async function handleSubmit(values: Record<string, any>) {
    // Step 1️⃣: Create account with metadata (Redux thunk handles saving full_name, user_name, avatar_url)
    await dispatch(
      register({
        fullName: values.fullName,
        userName: values.userName,
        email: values.email,
        password: values.password,
        avatarUrl: values.avatarUrl || null,
      })
    );

    // Step 2️⃣: Optional double-check for avatar URL persistence
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user && values.avatarUrl?.trim()) {
      const avatarUrl = values.avatarUrl.trim();
      // Update in public.profiles to guarantee visibility in Layout.tsx
      await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", auth.user.id);
      // Optional: sync back to auth metadata (redundant safety)
      await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
    }
  }

  // Step 3️⃣: Redirect to dashboard if already logged in
  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  return (
    <RegisterForm
      title="Register"
      fields={fields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel={isLoading ? "Registering..." : "Register"}
      rightImageUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/registerImg.jpg"
      logoUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
      bottomText="You already have an account?"
      bottomLinkLabel="Login"
      onBottomLink={() => navigate("/login")}
    />
  );
}
