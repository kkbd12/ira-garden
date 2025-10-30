import React, { useState } from 'react';
import type { Photo } from '../types';
import Card from './Card';
import { supabase } from '../supabaseClient';

interface PhotoFormProps {
  onSave: (photo: Omit<Photo, 'id'>) => void;
  onCancel: () => void;
}

const PhotoForm: React.FC<PhotoFormProps> = ({ onSave, onCancel }) => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ছবি (image) ফাইল আপলোড করা যাবে।');
      return;
    }

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery-photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      alert(`ত্রুটি: ছবি আপলোড করা যায়নি। (${uploadError.message})। আপনার কি 'gallery-photos' নামে একটি পাবলিক স্টোরেজ বাকেট আছে?`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('gallery-photos')
      .getPublicUrl(filePath);

    if (data.publicUrl) {
      setUrl(data.publicUrl);
    } else {
      alert('ত্রুটি: ছবির পাবলিক ইউআরএল পাওয়া যায়নি।');
    }
    setIsUploading(false);
    event.target.value = '';
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !caption.trim()) {
      alert('অনুগ্রহ করে একটি ছবি আপলোড করুন এবং একটি ক্যাপশন দিন।');
      return;
    }
    onSave({ url, caption });
  };

  return (
    <Card className="p-6 mb-8 rounded-t-none">
      <h3 className="text-xl font-semibold mb-4">নতুন ছবি যোগ করুন</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-2 p-4 border rounded-md bg-gray-50">
            {url ? (
                <div className="relative group">
                    <img src={url} alt="Uploaded preview" className="w-full h-48 object-contain rounded-md bg-gray-200" />
                    <button 
                        type="button" 
                        onClick={() => setUrl('')}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-75 group-hover:opacity-100"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ) : (
                <>
                    <label htmlFor="photoFile" className="block text-sm font-medium text-gray-700">ছবি ফাইল আপলোড করুন</label>
                    <input 
                        type="file" 
                        id="photoFile" 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" 
                        disabled={isUploading} 
                    />
                    {isUploading && <p className="text-sm text-blue-600 mt-2">ছবি আপলোড হচ্ছে...</p>}
                </>
            )}
        </div>

        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700">ক্যাপশন</label>
          <input 
            type="text" 
            id="caption" 
            value={caption} 
            onChange={e => setCaption(e.target.value)} 
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="ছবির একটি সংক্ষিপ্ত বর্ণনা দিন"
            required 
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">বাতিল করুন</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700" disabled={isUploading || !url}>
            {isUploading ? 'আপলোড হচ্ছে...' : 'সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PhotoForm;
