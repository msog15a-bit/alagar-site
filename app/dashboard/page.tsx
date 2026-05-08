'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation' // استيراد الموجه
import { Upload, X, Loader2 } from 'lucide-react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const router = useRouter() // تعريف الموجه

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (selectedImages.length + files.length > 20) {
        alert('لا يمكن رفع أكثر من 20 صورة')
        return
      }
      setSelectedImages([...selectedImages, ...files])
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPreviews([...previews, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...selectedImages]
    const newPreviews = [...previews]
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setSelectedImages(newImages)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const imageUrls = []
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}-${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('estate_images')
          .upload(fileName, file)
        
        if (uploadError) throw uploadError

        if (data) {
          const { data: urlData } = supabase.storage
            .from('estate_images')
            .getPublicUrl(fileName)
          imageUrls.push(urlData.publicUrl)
        }
      }

      const { error } = await supabase.from('real_estate').insert([{
        neighborhood_name: formData.get('neighborhood'),
        property_type: formData.get('type'),
        price: formData.get('price'),
        area: formData.get('area'),
        details: formData.get('details'),
        city: formData.get('city'),
        images: imageUrls
      }])

      if (error) throw error
      
      alert('تم إضافة الإعلان بنجاح!')
      // الانتقال التلقائي لصفحة البروفايل
      router.push('/profile') 
      
    } catch (err: any) {
      alert('خطأ: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 flex justify-center items-start pt-10" dir="rtl">
      <div className="bg-[#ffffff] p-6 md:p-10 rounded-[32px] shadow-xl w-full max-w-2xl border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-8 text-[#111827] border-r-4 border-[#1e3a8a] pr-3">إضافة عقار جديد</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">المدينة</label>
              <input name="city" placeholder="مثال: الرياض" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-[#d1d5db]" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">الحي</label>
              <input name="neighborhood" placeholder="مثال: النرجس" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-[#d1d5db]" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">نوع العقار</label>
              <select name="type" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]">
                <option>فيلا</option>
                <option>شقة</option>
                <option>أرض</option>
                <option>دور</option>
                <option>عمارة</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">السعر (ريال)</label>
              <input name="price" type="number" placeholder="0.00" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-[#374151] mr-1">المساحة (م²)</label>
            <input name="area" type="number" placeholder="مثال: 360" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-[#374151] mr-1">تفاصيل إضافية</label>
            <textarea name="details" placeholder="اكتب وصفاً مختصراً للعقار..." rows={3} className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]"></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#374151] mr-1">صور العقار (بحد أقصى 20)</label>
            <div className="border-2 border-dashed border-[#1e3a8a]/30 rounded-[24px] p-8 bg-[#f8fafc] hover:bg-[#f1f5f9] text-center relative">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="flex flex-col items-center gap-2">
                <Upload size={28} className="text-[#1e3a8a]" />
                <span className="font-bold text-[#1e3a8a]">اضغط لرفع الصور</span>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-[20px] font-bold text-lg hover:bg-[#1e3a8a]/90 transition-all shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> جاري الحفظ...</> : 'نشر الإعلان الآن'}
          </button>
        </form>
      </div>
    </div>
  )
}