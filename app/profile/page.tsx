'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Trash2, Edit3, Ruler, Banknote, LogOut, Plus } from 'lucide-react'

// --- 1. قسم الهيدر ---
const CardHeader = ({ listingType, city, neighborhood, propertyType }: any) => {
  return (
    <div className="bg-[#172554] p-5 text-white flex justify-between items-center px-8">
      <div className="flex flex-col">
        <span className="text-[20px] font-bold leading-tight">
          {city} - {neighborhood}
        </span>
      </div>

      <span className="text-[18px] font-black">{propertyType}</span>

      <span className="bg-white/20 px-5 py-2 rounded-full text-[20px] font-bold">
        {listingType}
      </span>
    </div>
  )
}

// --- 2. قسم الإحصائيات ---
const PropertyStats = ({ area, price }: any) => (
  <div
    className="grid grid-cols-2 border-b border-gray-100 bg-white"
    style={{ paddingTop: '5px', paddingBottom: '5px' }}
  >
    <div className="p-4 flex items-center justify-center gap-3 border-l border-gray-100">
      <Banknote className="text-green-500" size={22} />
      <span className="text-[12px] font-bold text-gray-500">
        السعر: <b className="text-[22px] text-gray-900">{Number(price).toLocaleString()}</b>
      </span>
    </div>

    <div className="p-4 flex items-center justify-center gap-3">
      <Ruler className="text-blue-500" size={22} />
      <span className="text-[12px] font-bold text-gray-600">
        المساحة: <b className="text-[22px] text-gray-600">{area} م²</b>
      </span>
    </div>
  </div>
)

// --- 3. الأزرار ---
const CardFooter = ({ onEdit, onDelete }: any) => (
  <div className="grid grid-cols-2 gap-4 p-6 pt-2 bg-white" style={{ marginBottom: '10px' }}>
    <button
      onClick={onEdit}
      className="bg-[#172554] text-white py-4 rounded-[25px] text-[18px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
    >
      <Edit3 size={20} /> تعديل الاعلان
    </button>

    <button
      onClick={onDelete}
      className="bg-red-600 text-white py-4 rounded-[25px] text-[18px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
    >
      <Trash2 size={20} /> حذف الاعلان
    </button>
  </div>
)

// --- الصفحة الرئيسية ---
export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [myListings, setMyListings] = useState<any[]>([])
  const [officeName, setOfficeName] = useState('')

  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return router.push('/login')

      setUser(user)
      setOfficeName(user.user_metadata?.office_name || 'مكتب عقاري')

      const { data } = await supabase
        .from('real_estate')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setMyListings(data)

      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف الإعلان؟')) return

    const { error } = await supabase
      .from('real_estate')
      .delete()
      .eq('id', id)

    if (!error) {
      setMyListings(myListings.filter((item) => item.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-[20px] font-bold">
        جاري تحميل البيانات...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center font-sans" dir="rtl">

      <div className="w-full max-w-xl bg-[#172554] p-8 rounded-[45px] shadow-xl mb-10 text-white text-center relative">
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
          className="absolute left-8 top-10 opacity-60 hover:opacity-100"
        >
          <LogOut size={22} />
        </button>

        <h1 className="text-[28px] font-bold">{officeName}</h1>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 bg-yellow-400 text-[#172554] px-10 py-3 rounded-[20px] font-black text-[18px] flex items-center gap-2 mx-auto shadow-lg hover:bg-yellow-300 transition-all"
        >
          <Plus size={22} /> اضافة عقار جديد
        </button>
      </div>

      <div className="w-full max-w-xl space-y-10">
        {myListings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100"
          >
            <CardHeader
              city={item.city}
              neighborhood={item.neighborhood_name}
              propertyType={item.property_type}
              listingType={item.listing_type}
            />

            <PropertyStats
              area={item.area}
              price={item.price}
            />

            <CardFooter
              onEdit={() => router.push('/dashboard?edit=' + item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}