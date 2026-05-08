'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Trash2, Edit3, Ruler, Banknote, LogOut, Plus, Info } from 'lucide-react'

// --- 1. قسم الهيدر (العناوين العلوية) ---
const CardHeader = ({ city, neighborhood, propertyType, listingType }) => (
  <div className="bg-[#172554] p-5 text-white flex justify-between items-center px-8">
    <div className="flex flex-col" style={{ marginTop: '-0px' }}> {/* تحكم في نزول العنوان هنا */}
     
      <span className="text-[20px] font-bold leading-tight">{city} - {neighborhood}</span>
    </div>

    <span className="text-[18px] font-black">{propertyType}</span>   {/* نوع العقار */}

    <span className="bg-white/20 px-5 py-2 rounded-full text-[20px] font-bold">  {/* نوع العرض */}
      {listingType}
    </span>
  </div>
);

// --- 2. قسم الإحصائيات (المساحة والسعر) ---
const PropertyStats = ({ area, price }) => (
  <div className="grid grid-cols-2 border-b border-gray-100 bg-white" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
    {/* قسم السعر */}
    <div className="p-4 flex items-center justify-center gap-3 border-l border-gray-100">
      <Banknote className="text-green-500" size={22} style={{ marginBottom: '0px' }} /> {/* رفع ونزول الأيقونة */}
      <span className="text-[12px] font-bold text-gray-500">
        السعر: <b className="text-[22px] text-gray-900">{Number(price).toLocaleString()}</b>
      </span>
    </div>
    
    {/* قسم المساحة */}
    <div className="p-4 flex items-center justify-center gap-3">
      <Ruler className="text-blue-500" size={22} style={{ marginBottom: '0px' }} /> {/* رفع ونزول الأيقونة */}
      <span className="text-[12px] font-bold text-gray-600">
        المساحة: <b className="text-[22px] text-gray-600">{area} م²</b>
      </span>
    </div>
  </div>
);

// --- 3. قسم المحتوى (التفاصيل والصورة) ---
const CardBody = ({ images, details }) => (
  <div className="flex p-5 gap-6 items-center min-h-[170px] bg-white" style={{ marginTop: '0px' }}>
    {/* جهة النص (التفاصيل) */}
    <div className="flex-1 text-right overflow-hidden" style={{ paddingRight: '5px' }}>
      <p className="text-gray-700 font-bold leading-[1.6] text-[18px] whitespace-pre-line">
        {details || "لا توجد تفاصيل إضافية..."}
      </p>
    </div>
    
    {/* جهة الصورة */}
    <div className="w-[190px] h-[140px] flex-shrink-0" style={{ marginLeft: '5px' }}>
      {images && images.length > 0 ? (
        <img src={images[0]} className="w-full h-full object-cover rounded-[28px] shadow-sm border border-gray-100" alt="عقار" />
      ) : (
        <div className="w-full h-full bg-gray-50 rounded-[28px] flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-300 text-[12px]">
          لا توجد صورة
        </div>
      )}
    </div>
  </div>
);

// --- 4. قسم أزرار التحكم (تعديل وحذف) ---
const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="grid grid-cols-2 gap-4 p-6 pt-2 bg-white" style={{ marginBottom: '10px' }}>
    <button onClick={onEdit} className="bg-[#172554] text-white py-4 rounded-[25px] text-[18px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
      <Edit3 size={20} /> تعديل الاعلان
    </button>
    <button onClick={onDelete} className="bg-red-600 text-white py-4 rounded-[25px] text-[18px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
      <Trash2 size={20} /> حذف الاعلان
    </button>
  </div>
);

// --- الصفحة الرئيسية ---
export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [officeName, setOfficeName] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      setUser(user);
      setOfficeName(user.user_metadata?.office_name || 'مكتب عقاري');
      const { data } = await supabase.from('real_estate').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setMyListings(data);
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف الإعلان؟')) return;
    const { error } = await supabase.from('real_estate').delete().eq('id', id);
    if (!error) setMyListings(myListings.filter(item => item.id !== id));
  };

  if (loading) return <div className="text-center mt-20 text-[20px] font-bold">جاري تحميل البيانات...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center font-sans" dir="rtl">
      {/* هيدر الملف الشخصي */}
      <div className="w-full max-w-xl bg-[#172554] p-8 rounded-[45px] shadow-xl mb-10 text-white text-center relative">
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="absolute left-8 top-10 opacity-60 hover:opacity-100">
          <LogOut size={22} />
        </button>
        <h1 className="text-[28px] font-bold">{officeName}</h1>
        <button onClick={() => router.push('/dashboard')} className="mt-6 bg-yellow-400 text-[#172554] px-10 py-3 rounded-[20px] font-black text-[18px] flex items-center gap-2 mx-auto shadow-lg hover:bg-yellow-300 transition-all">
          <Plus size={22} /> اضافة عقار جديد
        </button>
      </div>

      {/* قائمة العقارات */}
      <div className="w-full max-w-xl space-y-10">
        {myListings.map((item) => (
          <div key={item.id} className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
            <CardHeader city={item.city} neighborhood={item.neighborhood_name} propertyType={item.property_type} listingType={item.listing_type} />
            <PropertyStats area={item.area} price={item.price} />
            <CardBody images={item.images} details={item.details} />
            <ActionButtons onEdit={() => router.push('/dashboard?edit=' + item.id)} onDelete={() => handleDelete(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}