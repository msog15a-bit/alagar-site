'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, PlusCircle } from 'lucide-react'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [formData, setFormData] = useState({
    listing_type: 'للبيع',
    property_type: 'فيلا',
    city: '',
    neighborhood_name: '',
    price: '',
    area: '',
    details: ''
  })
  
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editId) fetchListing(editId)
  }, [editId])

  async function fetchListing(id: string) {
    const { data } = await supabase.from('real_estate').select('*').eq('id', id).single()
    if (data) {
      setFormData({
        listing_type: data.listing_type || 'للبيع',
        property_type: data.property_type || 'فيلا',
        city: data.city || '',
        neighborhood_name: data.neighborhood_name || '',
        price: data.price || '',
        area: data.area || '',
        details: data.details || ''
      })
      setImages(data.images || [])
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    
    const files = Array.from(e.target.files)
    const newUrls: string[] = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = Math.random().toString(36).substring(2) + '.' + fileExt
      
      // التعديل المستهدف: التأكد من استخدام estate_images
      const { data, error } = await supabase.storage
        .from('estate_images') 
        .upload(fileName, file)
      
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('estate_images').getPublicUrl(fileName)
        newUrls.push(publicUrl)
      } else {
        console.error('Error uploading:', error.message)
      }
    }

    setImages(prev => [...prev, ...newUrls])
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    const payload = { 
      ...formData, 
      images: images, 
      user_id: user?.id 
    }

    const { error } = editId 
      ? await supabase.from('real_estate').update(payload).eq('id', editId)
      : await supabase.from('real_estate').insert([payload])

    if (!error) {
      alert('تم حفظ البيانات بنجاح!')
      router.push('/profile')
    } else {
      alert('حدث خطأ أثناء الحفظ: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-[40px] shadow-lg border-t-8 border-[#172554]">
        <h1 className="text-2xl font-bold mb-8 text-[#172554] text-center">إدارة إعلان العقار</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select value={formData.listing_type} onChange={e => setFormData({...formData, listing_type: e.target.value})} className="p-4 border rounded-2xl bg-gray-50 outline-none font-bold">
              <option>للبيع</option><option>للايجار</option>
            </select>
            <select value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})} className="p-4 border rounded-2xl bg-gray-50 outline-none font-bold">
              <option>فيلا</option><option>شقة</option><option>أرض</option>
            </select>
          </div>
          <input placeholder="المدينة" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 border rounded-2xl outline-none" required />
          <input placeholder="اسم الحي" value={formData.neighborhood_name} onChange={e => setFormData({...formData, neighborhood_name: e.target.value})} className="w-full p-4 border rounded-2xl outline-none font-bold" required />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="السعر" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-4 border rounded-2xl outline-none" required />
            <input placeholder="المساحة" type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="p-4 border rounded-2xl outline-none" required />
          </div>
          <textarea placeholder="تفاصيل إضافية..." value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full p-4 border rounded-2xl h-24 outline-none" />
          
          <div className="p-6 border-2 border-dashed rounded-[35px] bg-gray-50 text-center">
            <p className="text-xs font-bold mb-4 text-gray-400 uppercase tracking-widest">معرض الصور ({images.length})</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} className="w-full h-full object-cover rounded-xl shadow-sm" />
                  <button type="button" onClick={() => setImages(images.filter(u => u !== img))} className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full p-1"><X size={12}/></button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center cursor-pointer bg-white">
                <PlusCircle className="text-blue-400" size={24} />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
              </label>
            </div>
            {uploading && <p className="text-blue-500 text-[10px] mt-2 animate-pulse font-bold">يتم الآن رفع الصور...</p>}
          </div>
          <button type="submit" disabled={loading || uploading} className="w-full bg-[#172554] text-white py-4 rounded-3xl font-bold text-lg mt-4 shadow-xl">
            {loading ? 'انتظر قليلاً...' : 'حفظ ونشر الإعلان'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Page() { return <Suspense fallback={<div>جاري التحميل...</div>}><DashboardContent/></Suspense> }