// FIX: Removed unnecessary triple-slash directive as it's not used in this file and was causing a build error.
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import NoticeBoardPage from './components/NoticeBoardPage';
import GalleryPage from './components/GalleryPage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import type { Page, Notice, Photo } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('publishDateTime', { ascending: false });
    
    if (error) {
      console.error('Error fetching notices:', error);
      setError('নোটিশ লোড করা সম্ভব হয়নি।');
      // Throw the error to be caught by Promise.all
      throw error;
    } else {
      setNotices(data || []);
    }
  }, []);

  const fetchPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      setError('ছবি লোড করা সম্ভব হয়নি।');
      // Throw the error to be caught by Promise.all
      throw error;
    } else {
      setPhotos(data || []);
    }
  }, []);
  
  useEffect(() => {
    // Initial data fetch
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchNotices(), fetchPhotos()]);
      } catch (e) {
        console.error("An error occurred during initial data fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();

    // Set up realtime subscriptions to listen for database changes
    const channel = supabase.channel('public-db-changes');
    
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, 
      (payload) => {
        console.log('Notice change received!', payload);
        fetchNotices(); // Re-fetch notices on any change
      }
    ).on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, 
      (payload) => {
        console.log('Photo change received!', payload);
        fetchPhotos(); // Re-fetch photos on any change
      }
    ).subscribe();

    // Cleanup function to remove subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };

  }, [fetchNotices, fetchPhotos]);

  useEffect(() => {
    try {
      const authStatus = sessionStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Failed to initialize auth status from storage:", error);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    setCurrentPage('home');
  };

  const addNotice = async (notice: Omit<Notice, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) {
        console.error('Error adding notice:', error);
        alert('ত্রুটি: নোটিশ যোগ করা যায়নি।');
    }
  };

  const updateNotice = async (updatedNotice: Notice) => {
    const { id, created_at, ...noticeData } = updatedNotice;
    const { error } = await supabase.from('notices').update(noticeData).eq('id', id);
    if (error) {
        console.error('Error updating notice:', error);
        alert('ত্রুটি: নোটিশ আপডেট করা যায়নি।');
    }
  };

  const deleteNotice = async (id: number): Promise<void> => {
    const noticeToDelete = notices.find(n => n.id === id);
    if (!noticeToDelete) {
        console.error('Error: Notice to delete not found in state.');
        alert('ত্রুটি: নোটিশটি খুঁজে পাওয়া যায়নি।');
        return;
    }

    // First, delete the file from storage if it exists
    if (noticeToDelete.pdfUrl) {
      try {
        const url = new URL(noticeToDelete.pdfUrl);
        // Path is everything after the bucket name, e.g., 'public/filename.pdf'
        const filePath = url.pathname.split(`/notice-pdfs/`)[1];
        if (filePath) {
            const { error: storageError } = await supabase.storage.from('notice-pdfs').remove([filePath]);
            if (storageError) {
                // Log the error but proceed to delete from DB, as the user's primary intent is to remove the notice
                console.error('Error deleting PDF from storage:', storageError);
                alert('সতর্কতা: স্টোরেজ থেকে পিডিএফ মোছা যায়নি, কিন্তু ডেটাবেস থেকে মুছে ফেলা হবে।');
            }
        }
      } catch(urlError){
          console.error("Could not parse URL, skipping storage deletion:", noticeToDelete.pdfUrl, urlError);
      }
    }

    // Then, delete the record from the database
    const { error: dbError } = await supabase.from('notices').delete().eq('id', id);
    if (dbError) {
        console.error('Error deleting notice from DB:', dbError);
        alert(`ত্রুটি: নোটিশ মোছা যায়নি। (${dbError.message})`);
    }
  };

  const addPhoto = async (photo: Omit<Photo, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('photos').insert([photo]);
    if (error) {
        console.error('Error adding photo:', error);
        alert('ত্রুটি: ছবি যোগ করা যায়নি।');
    }
  };

  const deletePhoto = async (id: number): Promise<void> => {
    const photoToDelete = photos.find(p => p.id === id);
    if (!photoToDelete) {
        console.error('Error: Photo to delete not found in state.');
        alert('ত্রুটি: ছবিটি খুঁজে পাওয়া যায়নি।');
        return;
    }
    
    // First, delete the file from storage
    if (photoToDelete.url) {
        try {
            const url = new URL(photoToDelete.url);
            const filePath = url.pathname.split(`/gallery-photos/`)[1];
            if(filePath) {
                const { error: storageError } = await supabase.storage.from('gallery-photos').remove([filePath]);
                if (storageError) {
                    console.error('Error deleting image from storage:', storageError);
                    alert('সতর্কতা: স্টোরেজ থেকে ছবিটি মোছা যায়নি, কিন্তু ডেটাবেস থেকে মুছে ফেলা হবে।');
                }
            }
        } catch(urlError) {
            console.error("Could not parse URL, skipping storage deletion:", photoToDelete.url, urlError);
        }
    }

    // Then, delete the record from the database
    const { error: dbError } = await supabase.from('photos').delete().eq('id', id);
    if (dbError) {
        console.error('Error deleting photo from DB:', dbError);
        alert(`ত্রুটি: ছবি মোছা যায়নি। (${dbError.message})`);
    }
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-lg p-6">
          <p className="text-xl font-bold mb-2">একটি ত্রুটি ঘটেছে</p>
          <p className="text-base">{error}</p>
          <p className="text-sm mt-4 text-gray-700">অনুগ্রহ করে আপনার Supabase URL এবং কী সঠিক আছে কিনা এবং Vercel-এ সেট করা আছে কিনা তা পরীক্ষা করুন।</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'notice':
        return <NoticeBoardPage notices={notices} />;
      case 'gallery':
        return <GalleryPage photos={photos} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'admin':
        return isAuthenticated ? <AdminPage notices={notices} addNotice={addNotice} updateNotice={updateNotice} deleteNotice={deleteNotice} photos={photos} addPhoto={addPhoto} deletePhoto={deletePhoto} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
