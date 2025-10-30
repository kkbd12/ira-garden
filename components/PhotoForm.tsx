
import React, { useState } from 'react';
import type { Photo } from '../types';
import Card from './Card';

interface PhotoFormProps {
  onSave: (photo: Omit<Photo, 'id'>) => void;
  onCancel: () => void;
}

const PhotoForm: React.FC<PhotoFormProps> = ({ onSave, onCancel }) => {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !caption.trim()) {
      alert('অনুগ্রহ করে ছবির লিঙ্ক এবং ক্যাপশন উভয়ই পূরণ করুন।');
      return;
    }
    onSave({ url, caption });
  };

  return (
    <Card className="p-6 mb-8 rounded-t-none">
      <h3 className="text-xl font-semibold mb-4">নতুন ছবি যোগ করুন</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">ছবির লিঙ্ক (URL)</label>
          <input 
            type="url" 
            id="url" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="https://example.com/image.jpg"
            required 
          />
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
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">সংরক্ষণ করুন</button>
        </div>
      </form>
    </Card>
  );
};

export default PhotoForm;
