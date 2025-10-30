import React, { useState, useEffect } from 'react';
import type { Notice } from '../types';
import Card from './Card';
import { supabase } from '../supabaseClient';

interface NoticeFormProps {
  noticeToEdit?: Notice | null;
  onSave: (notice: Omit<Notice, 'id'> | Notice) => void;
  onCancel: () => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ noticeToEdit, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [isAlreadyPublished, setIsAlreadyPublished] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (noticeToEdit) {
      const publishDate = new Date(noticeToEdit.publishDateTime);
      const now = new Date();
      
      if (publishDate <= now) {
        setIsAlreadyPublished(true);
        setPublishMode('schedule'); 
      } else {
        setIsAlreadyPublished(false);
        setPublishMode('schedule');
      }

      setTitle(noticeToEdit.title);
      const [datePart, timePart] = (noticeToEdit.publishDateTime || '').split('T');
      setDate(datePart || '');
      setTime(timePart || '');
      setContent(noticeToEdit.content);
      setAuthor(noticeToEdit.author);
      setIsUrgent(noticeToEdit.isUrgent || false);
      setPdfUrl(noticeToEdit.pdfUrl || '');
      
      if (noticeToEdit.expiryDate) {
        setHasExpiry(true);
        setExpiryDate(noticeToEdit.expiryDate);
      } else {
        setHasExpiry(false);
        setExpiryDate('');
      }

    } else {
      setIsAlreadyPublished(false);
      setPublishMode('now');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const isoString = now.toISOString();
      setDate(isoString.slice(0, 10));
      setTime(isoString.slice(11, 16));
      setHasExpiry(false);
      setExpiryDate('');
    }
  }, [noticeToEdit]);

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('শুধুমাত্র পিডিএফ ফাইল আপলোড করা যাবে।');
      return;
    }

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('notice-pdfs')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      alert(`ত্রুটি: ফাইল আপলোড করা যায়নি। (${uploadError.message})। আপনার কি 'notice-pdfs' নামে একটি পাবলিক স্টোরেজ বাকেট আছে?`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('notice-pdfs')
      .getPublicUrl(filePath);

    if (data.publicUrl) {
      setPdfUrl(data.publicUrl);
    } else {
      alert('ত্রুটি: ফাইলের পাবলিক ইউআরএল পাওয়া যায়নি।');
    }
    setIsUploading(false);
    // Reset file input
    event.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let publishDateTime: string;

    if (noticeToEdit && isAlreadyPublished) {
        publishDateTime = noticeToEdit.publishDateTime;
    } else if (publishMode === 'now') {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        publishDateTime = now.toISOString().slice(0, 16);
    } else {
        if (!date || !time) {
            alert('অনুগ্রহ করে প্রকাশের তারিখ এবং সময় নির্ধারণ করুন।');
            return;
        }
        publishDateTime = `${date}T${time}`;
    }

    if (hasExpiry && !expiryDate) {
        alert('অনুগ্রহ করে একটি শেষ তারিখ নির্ধারণ করুন।');
        return;
    }

    const noticeData = { 
        title, 
        content, 
        author, 
        isUrgent, 
        pdfUrl, 
        publishDateTime,
        expiryDate: hasExpiry && expiryDate ? expiryDate : undefined,
     };

    if (noticeToEdit) {
      onSave({ ...noticeData, id: noticeToEdit.id });
    } else {
      onSave(noticeData);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">{noticeToEdit ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ তৈরি করুন'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">শিরোনাম</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        
        <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">প্রকাশের সময়</legend>
            <div className="flex items-center gap-6">
                <div className="flex items-center">
                    <input 
                        type="radio" 
                        id="publishNow" 
                        name="publishMode" 
                        value="now"
                        checked={publishMode === 'now'}
                        onChange={() => setPublishMode('now')}
                        disabled={isAlreadyPublished}
                        className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <label htmlFor="publishNow" className="ml-2 block text-sm text-gray-900">এখনই প্রকাশ করুন</label>
                </div>
                <div className="flex items-center">
                    <input 
                        type="radio" 
                        id="scheduleLater" 
                        name="publishMode" 
                        value="schedule"
                        checked={publishMode === 'schedule'}
                        onChange={() => setPublishMode('schedule')}
                        disabled={isAlreadyPublished}
                        className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <label htmlFor="scheduleLater" className="ml-2 block text-sm text-gray-900">পরে প্রকাশ করুন</label>
                </div>
            </div>
            {isAlreadyPublished && <p className="text-xs text-gray-500 mt-2">এই নোটিশটি ইতিমধ্যে প্রকাশিত হয়েছে। প্রকাশের সময় পরিবর্তন করা যাবে না।</p>}
        </fieldset>
        
        {publishMode === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">প্রকাশের তারিখ</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required disabled={isAlreadyPublished} />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">প্রকাশের সময়</label>
                    <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required disabled={isAlreadyPublished} />
                </div>
            </div>
        )}
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">বিষয়বস্তু</label>
          <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">লেখক</label>
          <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        
        <div className="space-y-2 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
                <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700">পিডিএফ লিঙ্ক (ঐচ্ছিক)</label>
                {pdfUrl && (
                    <button type="button" onClick={() => setPdfUrl('')} className="text-xs text-red-600 hover:underline">মুছে ফেলুন</button>
                )}
            </div>
            <input type="url" id="pdfUrl" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://..."/>
            
            <div className="text-center my-2">
                <span className="text-xs text-gray-500">অথবা</span>
            </div>

            <div>
                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700">পিডিএফ ফাইল আপলোড করুন</label>
                <input type="file" id="pdfFile" onChange={handlePdfUpload} accept=".pdf" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" disabled={isUploading} />
                {isUploading && <p className="text-sm text-blue-600 mt-2">ফাইল আপলোড হচ্ছে...</p>}
            </div>
        </div>

        <div>
            <div className="flex items-center">
                <input type="checkbox" id="hasExpiry" checked={hasExpiry} onChange={e => setHasExpiry(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
                <label htmlFor="hasExpiry" className="ml-2 block text-sm text-gray-900">এই নোটিশের একটি শেষ তারিখ সেট করুন</label>
            </div>
        </div>

        {hasExpiry && (
            <div className="p-4 border rounded-md bg-gray-50">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">শেষ তারিখ</label>
                <input type="date" id="expiryDate" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required />
                 <p className="text-xs text-gray-500 mt-1">এই তারিখের পর নোটিশটি আর বোর্ডে দেখা যাবে না।</p>
            </div>
        )}

        <div className="flex items-center">
          <input type="checkbox" id="isUrgent" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
          <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">এটি কি একটি জরুরী নোটিশ?</label>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">বাতিল করুন</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700" disabled={isUploading}>
            {isUploading ? 'আপলোড হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
        </div>
      </form>
    </Card>
  );
};

export default NoticeForm;
