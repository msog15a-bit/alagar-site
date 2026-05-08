'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, Search } from 'lucide-react'

export default function AdminMatcher() {
  const [listings, setListings] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  async function checkAdminAccess() {
    const { data: { user } } = await supabase.auth.getUser()
    
    // --- شرط الحماية القوي ---
    // إذا لم يكن المستخدم هو الأدمن صاحب الرقم 0500000000، اطرده فوراً
    if (!user || user.email !== '0500000000@app.com') {
      router.push('/profile')
      return
    }
    
    fetchData()
  }

  async function fetchData() {
    const { data } = await supabase.from('real_estate').select('*')
    if (data) {
      setListings(data)
      findMatches(data)
    }
    setLoading(false)
  }

  function findMatches(allData: any[]) {
    const available = allData.filter(item => item.listing_type === 'للبيع' || item.listing_type === 'للايجار')
    const requests = allData.filter(item => item.listing_type === 'مطلوب')
    
    let foundMatches: any[] = []
    requests.forEach(req => {
      const potential = available.filter(avail => 
        avail.city === req.city && 
        avail.neighborhood_name === req.neighborhood_name &&
        avail.property_type === req.property_type &&
        Math.abs(avail.price - req.price) <= (req.price * 0.2)
      )
      if (potential.length > 0) foundMatches.push({ request: req, options: potential })
    })
    setMatches(foundMatches)
  }

  if (loading) return <div className="text-center mt-20 font-bold">جاري التحقق من صلاحيات الإدارة...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-[#172554] p-8 rounded-[40px] text-white">
          <h1 className="text-3xl font-bold">لوحة تحكم الإدارة - المطابقة</h1>
          <div className="bg-white/10 p-4 rounded-3xl border border-white/20">
            <span className="text-sm block">إجمالي العقارات</span>
            <span className="text-2xl font-bold">{listings.length}</span>
          </div>
        </header>

        {matches.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed">
            <p className="text-gray-400 font-bold">لا توجد مطابقات حالياً</p>
          </div>
        ) : (
          <div className="space-y-8">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-white rounded-[40px] shadow-sm border border-blue-100 overflow-hidden">
                <div className="bg-blue-50 p-6 border-b border-blue-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#172554] text-white p-3 rounded-2xl"><Search size={24}/></div>
                    <div>
                      <span className="text-xs text-blue-600 font-bold">طلب من العميل</span>
                      <h3 className="font-bold text-lg">مطلوب {match.request.property_type} في {match.request.neighborhood_name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {match.options.map((opt: any) => (
                     <div key={opt.id} className="bg-white p-4 rounded-3xl border border-green-100 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-gray-800">عرض مطابق: {Number(opt.price).toLocaleString()} ريال</div>
                          <div className="text-xs text-gray-400">تواصل مع المعلن: {opt.phone}</div>
                        </div>
                        <CheckCircle className="text-green-500" />
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}