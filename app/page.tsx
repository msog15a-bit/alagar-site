'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Phone, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [phone, setPhone] = useState('') 
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // تحويل الرقم المدخل (مثلاً 0500000000) إلى الصيغة الدولية (+966500000000)
    let formattedPhone = phone.trim()
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+966' + formattedPhone.substring(1)
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password: password,
      })

      if (error) {
        alert('خطأ في الدخول: تأكد من رقم الجوال وكلمة المرور')
      } else {
        router.push('/dashboard') 
      }
    } catch (err) {
      alert('حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a]">alagar.click</h1>
          <p className="text-gray-500 mt-2">تسجيل الدخول</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
              <Phone size={16} className="text-[#1e3a8a]" /> رقم الجوال
            </label>
            <input 
              type="text" // تغيير النوع ليتوقف عن طلب الإيميل
              required
              placeholder="0500000000" 
              className="w-full p-4 border rounded-2xl bg-gray-50 outline-none text-right focus:ring-2 focus:ring-[#1e3a8a] border-gray-200" 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 mr-1 flex items-center gap-2">
              <Lock size={16} className="text-[#1e3a8a]" /> كلمة المرور
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full p-4 border rounded-2xl bg-gray-50 outline-none text-right focus:ring-2 focus:ring-[#1e3a8a] border-gray-200" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1e3a8a]/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}