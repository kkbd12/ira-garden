import React, { useState } from 'react';
import type { Notice, Photo } from '../types';
import Card from './Card';
import NoticeForm from './NoticeForm';
import PhotoForm from './PhotoForm';
import LogoutButton from './LogoutButton';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';
import PdfIcon from './icons/PdfIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface AdminPageProps {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: number) => Promise<void>;
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  deletePhoto: (id: number) => Promise<void>;
  onLogout: () => void;
}

type AdminTab = 'notices' | 'gallery';

const AdminPage: React.FC<AdminPageProps> = ({ 
    notices, addNotice, updateNotice, deleteNotice, 
    photos, addPhoto, deletePhoto,
    onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('notices');

  // Notice state
  const [isNoticeFormVisible, setIsNoticeFormVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Photo state
  const [isPhotoFormVisible, setIsPhotoFormVisible] = useState(false);

  // Deletion loading state
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  
  const displayedNotices = notices;

  // Notice handlers
  const handleAddNewNotice = () => {
    setEditingNotice(null);
    setIsNoticeFormVisible(true);
  };
  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setIsNoticeFormVisible(true);
  };
  const handleSaveNotice = (notice: Omit<Notice, 'id'> | Notice) => {
    if ('id' in notice) {
      updateNotice(notice);
    } else {
      addNotice(notice);
    }
    setIsNoticeFormVisible(false);
    setEditingNotice(null);
  };
  const handleCancelNotice = () => {
    setIsNoticeFormVisible(false);
    setEditingNotice(null);
  };

  const handleDeleteNotice = async (id: number) => {
    setDeletingItemId(id);
    await deleteNotice(id);
    setDeletingItemId(null);
  }
  
  // Photo handlers
  const handleSavePhoto = (photo: Omit<Photo, 'id'>) => {
    addPhoto(photo);
    setIsPhotoFormVisible(false);
  };
  const handleCancelPhoto = () => {
    setIsPhotoFormVisible(false);
  };

  const handleDeletePhoto = async (id: number) => {
    setDeletingItemId(id);
    await deletePhoto(id);
    setDeletingItemId(null);
  }
  
  const formatAdminDateTime = (dateTimeStr: string) => {
    try {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('bn-BD', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    } catch {
        return dateTimeStr;
    }
  }

  const getTabClass = (tabName: AdminTab) => {
      const baseClass = "px-4 py-2 font-semibold rounded-t-lg transition-colors";
      if(activeTab === tabName) {
          return `${baseClass} bg-white text-teal-600 border-b-2 border-teal-600`;
      }
      return `${baseClass} bg-gray-100 text-gray-600 hover:bg-gray-200`;
  }


  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-teal-700">অ্যাডমিন প্যানেল</h2>
            <LogoutButton onLogout={onLogout} />
        </div>

        {/* Tabs */}
        <div className="mb-[-1px] flex border-b">
            <button onClick={() => setActiveTab('notices')} className={getTabClass('notices')}>
                নোটিশ ম্যানেজমেন্ট
            </button>
            <button onClick={() => setActiveTab('gallery')} className={getTabClass('gallery')}>
                গ্যালারী ম্যানেজমেন্ট
            </button>
        </div>

        {activeTab === 'notices' && (
            isNoticeFormVisible ? (
                <NoticeForm noticeToEdit={editingNotice} onSave={handleSaveNotice} onCancel={handleCancelNotice} />
            ) : (
                <Card className="p-4 md:p-6 rounded-t-none">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h3 className="text-xl font-semibold">
                            সকল নোটিশ
                        </h3>
                        <button onClick={handleAddNewNotice} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors duration-300 w-full md:w-auto">
                            <AddIcon />
                            <span>নতুন নোটিশ</span>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {displayedNotices.length > 0 ? displayedNotices.map(notice => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isExpired = notice.expiryDate && new Date(notice.expiryDate) < today;
                            const isDeleting = deletingItemId === notice.id;

                            return (
                                <div key={notice.id} className={`p-4 border rounded-lg flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between transition-opacity ${isExpired ? 'bg-red-50 border-red-200' : 'bg-gray-50'} ${isDeleting ? 'opacity-50' : ''}`}>
                                    <div className="w-full">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-lg">{notice.title}</p>
                                            {notice.pdfUrl && (
                                                <span className="text-teal-600" title="পিডিএফ সংযুক্ত আছে"><PdfIcon/></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">প্রকাশিত: {formatAdminDateTime(notice.publishDateTime)}</p>
                                         {notice.expiryDate && (
                                            <p className={`text-sm mt-1 ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                                শেষ তারিখ: {new Date(notice.expiryDate).toLocaleDateString('bn-BD')} {isExpired && '(মেয়াদ উত্তীর্ণ)'}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                                        <button onClick={() => handleEditNotice(notice)} className="p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50" aria-label="সম্পাদনা করুন" disabled={isDeleting}><EditIcon /></button>
                                        <button onClick={() => handleDeleteNotice(notice.id)} className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50" aria-label="মুছে ফেলুন" disabled={isDeleting}>
                                            {isDeleting ? <SpinnerIcon /> : <DeleteIcon />}
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-6 text-gray-500">
                                <p>কোনো নোটিশ পাওয়া যায়নি।</p>
                            </div>
                        )}
                    </div>
                </Card>
            )
        )}
        
        {activeTab === 'gallery' && (
             isPhotoFormVisible ? (
                <PhotoForm onSave={handleSavePhoto} onCancel={handleCancelPhoto} />
            ) : (
                <Card className="p-4 md:p-6 rounded-t-none">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">সকল ছবি</h3>
                        <button onClick={() => setIsPhotoFormVisible(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors duration-300">
                            <AddIcon />
                            <span>নতুন ছবি যোগ করুন</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {photos.map(photo => {
                            const isDeleting = deletingItemId === photo.id;
                            return (
                                <div key={photo.id} className={`relative group border rounded-lg overflow-hidden shadow transition-opacity ${isDeleting ? 'opacity-50' : ''}`}>
                                    <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex justify-center items-center">
                                        <button onClick={() => handleDeletePhoto(photo.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100" aria-label="মুছে ফেলুন" disabled={isDeleting}>
                                            {isDeleting ? <SpinnerIcon /> : <DeleteIcon />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )
        )}
    </div>
  );
};

export default AdminPage;
