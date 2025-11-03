import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'
import type { Field } from '../types/ui'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const fields: Field[] = [
    { name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', required: true },
    { name: 'userName', label: 'Username',  placeholder: 'Enter your username',  required: true },
    { name: 'email',    label: 'Email',     type: 'email',   placeholder: 'Enter your mail', required: true },
    { name: 'password', label: 'Password',  type: 'password', placeholder: 'Enter your password', required: true },
  ]

  const initialValues = { fullName: '', userName: '', email: '', password: '' }

  function handleSubmit(values: Record<string, string>) {
    const ok = register({
      fullName: values.fullName,
      userName: values.userName,
      email: values.email,
      password: values.password,
    })
    if (ok !== false) {
      navigate('/login')  
    }
  }

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
      onBottomLink={() => navigate('/login')}
    />
  )
}