'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        alert('خطأ في الدخول: ' + error.message)
      } else {
        // التوجيه إلى لوحة التحكم بعد نجاح الدخول
        router.push('/dashboard')
      }
    } catch (err: any) {
      alert('حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-[#1e3a8a]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#1e3a8a]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[#111827]">تسجيل الدخول</h1>
          <p className="text-gray-500 mt-2">نظام إدارة العقارات المتطور</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-2 flex items-center gap-2">
              <Mail size={18} className="text-[#1e3a8a]" /> البريد الإلكتروني
            </label>
            <input 
              type="email" 
              required
              placeholder="example@mail.com" 
              className="w-full p-4 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-gray-200 transition-all text-left"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-2 flex items-center gap-2">
              <Lock size={18} className="text-[#1e3a8a]" /> كلمة المرور
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full p-4 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-gray-200 transition-all text-left"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1e3a8a]/90 transition-all shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} /> جاري التحقق...</> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}