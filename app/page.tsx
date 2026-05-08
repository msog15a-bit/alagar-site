'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // ������� �� ������ ����� (�� ���� 20)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (selectedImages.length + files.length > 20) {
        alert('����� �� ���� ����� �� 20 ���� ������� ������')
        return
      }
      setSelectedImages([...selectedImages, ...files])
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPreviews([...previews, ...newPreviews])
    }
  }

  // ��� ���� �� �������� ��� �����
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

      // 2. ����� �������� �� ������ (��� ���� ������ �����)
      const { error } = await supabase.from('real_estate').insert([{
        neighborhood_name: formData.get('neighborhood'),
        property_type: formData.get('type'),
        price: formData.get('price'),
        area: formData.get('area'),
        details: formData.get('details'),
        city: formData.get('city'),
        images: imageUrls // ������ ������ ���� �������
      }])

      if (error) throw error
      alert('�� ��� ������ ����� �� ���!')
      window.location.reload()
    } catch (err: any) {
      alert('���: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 flex justify-center items-start pt-10" dir="rtl">
      <div className="bg-[#ffffff] p-6 md:p-10 rounded-[32px] shadow-xl w-full max-w-2xl border border-[#e5e7eb]">
        <h1 className="text-2xl font-bold mb-8 text-[#111827] border-r-4 border-[#1e3a8a] pr-3">����� ���� ����</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ������� ����� */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">�������</label>
              <input name="city" placeholder="�����: ������" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-[#d1d5db]" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">����</label>
              <input name="neighborhood" placeholder="�����: ������" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] focus:ring-2 focus:ring-[#1e3a8a] outline-none border-[#d1d5db]" required />
            </div>
          </div>

          {/* ����� ������ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">��� ������</label>
              <select name="type" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db] appearance-none">
                <option>����</option>
                <option>���</option>
                <option>���</option>
                <option>���</option>
                <option>�����</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#374151] mr-1">����� (����)</label>
              <input name="price" type="number" placeholder="0.00" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]" required />
            </div>
          </div>

          {/* ������� */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-[#374151] mr-1">������� (�)</label>
            <input name="area" type="number" placeholder="�����: 360" className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]" required />
          </div>
          
          {/* �������� */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-[#374151] mr-1">������ ������</label>
            <textarea name="details" placeholder="���� ������� ������ ���..." rows={3} className="w-full p-3.5 border rounded-2xl bg-[#f9fafb] outline-none border-[#d1d5db]"></textarea>
          </div>

          {/* ����� ��� ����� */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#374151] mr-1">��� ������ (�� ���� 20)</label>
            <div className="border-2 border-dashed border-[#1e3a8a]/30 rounded-[24px] p-8 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors text-center relative">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" id="img-upload" />
              <div className="flex flex-col items-center gap-2">
                <div className="bg-[#1e3a8a]/10 p-3 rounded-full text-[#1e3a8a]">
                  <Upload size={28} />
                </div>
                <span className="font-bold text-[#1e3a8a]">���� ����� ��� �� ���� ��������</span>
                <span className="text-xs text-[#64748b]">����� ��������: {selectedImages.length} �� 20</span>
              </div>
            </div>
          </div>

          {/* ���� �������� */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4 p-2 bg-gray-50 rounded-2xl">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={src} className="h-full w-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -left-2 bg-[#ef4444] text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* �� ����� */}
          <button 
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-[20px] font-bold text-lg hover:bg-[#1e3a8a]/90 transition-all shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                ���� ��� ����� ���� �������...
              </>
            ) : '��� ������� ����'}
          </button>
        </form>
      </div>
    </div>
  )
}
