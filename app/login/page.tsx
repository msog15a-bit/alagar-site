'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogIn, Smartphone, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // استخدام الجمع العادي للنصوص لضمان عدم حدوث خطأ في الصياغة
    const fakeEmail = phone + "@app.com";

    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: password,
    })

    if (error) {
      alert('خطأ في الدخول: تأكد من رقم الجوال وكلمة المرور');
      setLoading(false)
    } else {
      router.push('/listings')
    }
  }

  return (
    <div className="min-h-screen bg-[#172554] flex items-center justify-center p-4 text-right" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-10">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-[#172554]" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-500 mt-2">مرحباً بك في منصة العقارات الذكية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال</label>
            <div className="relative">
              <input 
                type="tel" 
                placeholder="05xxxxxxxx"
                className="w-full p-4 bg-gray-50 border rounded-2xl outline-none pr-12 focus:ring-2 focus:ring-[#172554]" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
              <Smartphone className="absolute right-4 top-4 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="********"
                className="w-full p-4 bg-gray-50 border rounded-2xl outline-none pr-12 focus:ring-2 focus:ring-[#172554]" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Lock className="absolute right-4 top-4 text-gray-400" size={20} />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#172554] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}