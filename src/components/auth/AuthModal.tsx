import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import FormField from '../ui/FormField'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { useValidatedForm } from '../../hooks/useValidatedForm'
import { email, minLength, required } from '../../lib/validators'

const inputClass = (error?: string) =>
  `input input-bordered w-full bg-white border ${error ? 'border-error' : 'border-gray-300'}`
const emailRule = email('กรุณากรอกอีเมลให้ถูกต้อง')
const passwordRule = minLength(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')

function LoginForm() {
  const navigate = useNavigate()
  const closeAuthModal = useUiStore((s) => s.closeAuthModal)
  const login = useAuthStore((s) => s.login)
  const [status, setStatus] = useState('')
  const { values, errors, handleChange, handleBlur, validateAll, reset } = useValidatedForm(
    { email: '', password: '' },
    { email: emailRule, password: passwordRule },
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll()) {
      setStatus('กรุณาแก้ไขข้อมูลในช่องที่มีข้อผิดพลาด')
      return
    }
    const role = login(values.email, values.password)
    reset()
    closeAuthModal()
    if (role === 'admin') navigate('/admin')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField label="อีเมล" name="email" error={errors.email}>
        <input id="email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur}
          aria-invalid={!!errors.email} className={inputClass(errors.email)} />
      </FormField>
      <FormField label="รหัสผ่าน" name="password" error={errors.password}>
        <input id="password" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur}
          aria-invalid={!!errors.password} className={inputClass(errors.password)} />
      </FormField>
      <button type="submit" className="btn btn-primary btn-block">เข้าสู่ระบบ</button>
      {status && <p className="text-sm" role="status">{status}</p>}
    </form>
  )
}

function RegisterForm() {
  const closeAuthModal = useUiStore((s) => s.closeAuthModal)
  const register = useAuthStore((s) => s.register)
  const [status, setStatus] = useState('')
  const { values, errors, handleChange, handleBlur, validateAll, reset } = useValidatedForm(
    { fullName: '', email: '', password: '', confirmPassword: '' },
    {
      fullName: required('กรุณากรอกชื่อ-นามสกุล'),
      email: emailRule,
      password: passwordRule,
      confirmPassword: [
        required('กรุณายืนยันรหัสผ่านให้ตรงกัน'),
        (value, all) => (value === all.password ? '' : 'รหัสผ่านไม่ตรงกัน'),
      ],
    },
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll()) {
      setStatus('กรุณาแก้ไขข้อมูลในช่องที่มีข้อผิดพลาด')
      return
    }
    // สมัครเสร็จให้ล็อกอินอัตโนมัติ
    register(values.fullName, values.email)
    reset()
    closeAuthModal()
  }

  const field = (name: 'fullName' | 'email' | 'password' | 'confirmPassword', label: string, type = 'text') => (
    <FormField label={label} name={name} error={errors[name]}>
      <input id={name} name={name} type={type} value={values[name]} onChange={handleChange} onBlur={handleBlur}
        aria-invalid={!!errors[name]} className={inputClass(errors[name])} />
    </FormField>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {field('fullName', 'ชื่อ-นามสกุล')}
      {field('email', 'อีเมล', 'email')}
      {field('password', 'รหัสผ่าน', 'password')}
      {field('confirmPassword', 'ยืนยันรหัสผ่าน', 'password')}
      <button type="submit" className="btn btn-secondary btn-block">สมัครสมาชิก</button>
      {status && <p className="text-sm" role="status">{status}</p>}
    </form>
  )
}

export default function AuthModal() {
  const { authModal, openAuthModal, closeAuthModal } = useUiStore()
  if (!authModal) return null
  const isLogin = authModal === 'login'

  return (
    <dialog className="modal modal-open" onClick={(e) => e.target === e.currentTarget && closeAuthModal()}>
      <div className="modal-box bg-white">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="ปิดหน้าต่าง" onClick={closeAuthModal}>
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold">{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <p className="mt-4 text-sm">
          {isLogin ? 'ยังไม่มีบัญชี? ' : 'มีบัญชีอยู่แล้ว? '}
          <button type="button" className="link link-primary" onClick={() => openAuthModal(isLogin ? 'register' : 'login')}>
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </p>
      </div>
    </dialog>
  )
}
