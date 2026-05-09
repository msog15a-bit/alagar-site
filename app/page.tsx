'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert('خطأ في الدخول: تأكد من البيانات')
      setLoading(false)
    } else {
      router.push('/dashboard') 
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-[#1e3a8a] mb-8">alagar.click</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none text-right" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none text-right" onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
            {loading ? <Loader2 className="animate-spin" /> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}