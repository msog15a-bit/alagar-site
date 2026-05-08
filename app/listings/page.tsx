'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Phone, MessageCircle, MapPin, Home, 
  Maximize2, DollarSign, X, ChevronRight, 
  ChevronLeft, ZoomIn 
} from 'lucide-react'

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    const { data } = await supabase
      .from('real_estate')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setListings(data)
  }

  const nextImage = (e: any) => {
    e.stopPropagation()
    if (selectedListing?.images) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedListing.images.length)
    }
  }

  const prevImage = (e: any) => {
    e.stopPropagation()
    if (selectedListing?.images) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedListing.images.length) % selectedListing.images.length)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-[#172554] mb-8 text-center">إعلانات العقارات</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {listings.map((item) => (
          <div 
            key={item.id} 
            onClick={() => { setSelectedListing(item); setCurrentImgIndex(0); }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            {/* الجزء العلوي (الهيدر) */}
            <div className="bg-[#172554] p-4 text-white flex justify-between items-center font-bold">
              <span>{item.city} - {item.neighborhood_name}</span>
              <span>{item.property_type}</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{item.listing_type}</span>
            </div>

            {/* شريط السعر والمساحة */}
            <div className="bg-gray-100 p-3 flex justify-around text-sm font-bold text-gray-700 border-b">
              <div className="flex items-center gap-1"><Maximize2 size={16}/> المساحة: {item.area} م²</div>
              <div className="flex items-center gap-1"><DollarSign size={16}/> السعر: {Number(item.price).toLocaleString()}</div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-4 flex gap-4">
              <div className="w-1/3 aspect-square rounded-2xl overflow-hidden bg-gray-200">
                <img src={item.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" />
              </div>
              <div className="w-2/3">
                <div className="bg-gray-50 text-xs p-1 inline-block rounded mb-2 text-gray-500">رقم: {item.id}</div>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{item.details}</p>
              </div>
            </div>

            {/* أزرار التواصل */}
            <div className="p-4 pt-0 flex gap-3">
              <a href={"https://wa.me/" + item.whatsapp} className="flex-1 bg-[#166534] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
                <MessageCircle size={18}/> واتس اب
              </a>
              <a href={"tel:" + item.phone} className="flex-1 bg-[#3f51b5] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm">
                <Phone size={18}/> إتصال
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* --- النافذة المنبثقة (MODAL) --- */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedListing(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            
            {/* زر الإغلاق */}
            <button onClick={() => setSelectedListing(null)} className="absolute top-6 left-6 z-50 bg-white shadow-lg p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors">
              <X size={24} />
            </button>

            <div className="overflow-y-auto">
              {/* قسم الصور في النافذة */}
              <div className="relative h-[300px] md:h-[450px] bg-black">
                {selectedListing.images?.length > 0 ? (
                  <>
                    <img src={selectedListing.images[currentImgIndex]} className="w-full h-full object-contain" />
                    {selectedListing.images.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all"><ChevronRight size={30}/></button>
                        <button onClick={nextImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all"><ChevronLeft size={30}/></button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-white text-sm">
                          {currentImgIndex + 1} / {selectedListing.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500"><ZoomIn size={48} /> لا توجد صور</div>
                )}
              </div>

              {/* تفاصيل العقار كاملة */}
              <div className="p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedListing.city} - {selectedListing.neighborhood_name}</h2>
                    <div className="flex gap-3">
                      <span className="bg-blue-100 text-[#172554] px-4 py-1 rounded-full font-bold">{selectedListing.property_type}</span>
                      <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-bold">{selectedListing.listing_type}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm mb-1 text-right">السعر الإجمالي</div>
                    <div className="text-3xl font-black text-[#172554] tracking-tighter text-right">{Number(selectedListing.price).toLocaleString()} ريال</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-3xl text-center">
                    <div className="text-gray-400 text-xs mb-1">المساحة</div>
                    <div className="font-bold text-lg">{selectedListing.area} م²</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl text-center">
                    <div className="text-gray-400 text-xs mb-1">رقم الإعلان</div>
                    <div className="font-bold text-lg">{selectedListing.id}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl text-center border-2 border-blue-50">
                    <div className="text-gray-400 text-xs mb-1">تاريخ النشر</div>
                    <div className="font-bold text-sm">{new Date(selectedListing.created_at).toLocaleDateString('ar-SA')}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-[#172554] rounded-full"></div>
                    تفاصيل الإعلان
                  </h3>
                  <p className="text-gray-600 leading-loose text-lg whitespace-pre-wrap bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    {selectedListing.details}
                  </p>
                </div>

                {/* أزرار التواصل النهائية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                   <a href={"https://wa.me/" + selectedListing.whatsapp} className="bg-[#166534] text-white py-5 rounded-[25px] flex items-center justify-center gap-3 font-bold text-xl shadow-lg hover:bg-green-800 transition-all">
                    <MessageCircle size={28}/> تواصل عبر الواتساب
                  </a>
                  <a href={"tel:" + selectedListing.phone} className="bg-[#3f51b5] text-white py-5 rounded-[25px] flex items-center justify-center gap-3 font-bold text-xl shadow-lg hover:bg-blue-800 transition-all">
                    <Phone size={28}/> إتصال مباشر
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}