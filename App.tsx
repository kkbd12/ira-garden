import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import NoticeBoardPage from './components/NoticeBoardPage';
import GalleryPage from './components/GalleryPage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import type { Page, Notice, Photo } from './types';

const mockNotices: Notice[] = [
  {
    id: 1,
    title: 'জরুরী মিটিং সংক্রান্ত নোটিশ',
    publishDateTime: '2024-07-20T10:00',
    content: 'আগামী ২২শে জুলাই, ২০২৪ তারিখে ভবনের সকল ফ্ল্যাট মালিকদের নিয়ে একটি জরুরী মিটিং-এর আয়োজন করা হয়েছে। ভবনের রক্ষণাবেক্ষণ এবং নিরাপত্তা সংক্রান্ত বিষয়ে আলোচনা করা হবে। সকলের উপস্থিতি একান্ত কাম্য।',
    author: 'বিল্ডিং ম্যানেজমেন্ট কমিটি',
    isUrgent: true,
    pdfUrl: '#',
    expiryDate: '2030-07-23', // This notice has a future expiry date
  },
  {
    id: 2,
    title: 'মাসিক সার্ভিস চার্জ প্রদান',
    publishDateTime: '2024-07-15T09:00',
    content: 'সকলকে জুলাই মাসের সার্ভিস চার্জ আগামী ২৫শে জুলাইয়ের মধ্যে পরিশোধ করার জন্য অনুরোধ করা হচ্ছে। নির্দিষ্ট সময়ের মধ্যে চার্জ পরিশোধ করে ভবনের পরিচালনায় সহযোগিতা করুন।',
    author: 'ম্যানেজার',
    pdfUrl: '#',
  },
  {
    id: 3,
    title: 'পরিষ্কার-পরিচ্ছন্নতা অভিযান',
    publishDateTime: '2024-07-10T14:30',
    content: 'আগামী শনিবার, ২০শে জুলাই, ভবনের চারপাশ এবং কমন স্পেস পরিষ্কার-পরিচ্ছন্ন করার জন্য একটি বিশেষ অভিযান চালানো হবে। এই সময়ে আপনাদের সহযোগিতার জন্য ধন্যবাদ।',
    author: 'বিল্ডিং ম্যানেজমেন্ট কমিটি',
  },
   {
    id: 4,
    title: 'পানি সরবরাহ প্রসঙ্গে (Expired)',
    publishDateTime: '2024-07-05T18:00',
    content: 'পানির পাম্প মেরামতের জন্য আগামী ৭ই জুলাই, সকাল ১০টা থেকে দুপুর ২টা পর্যন্ত পানি সরবরাহ বন্ধ থাকবে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।',
    author: 'ম্যানেজার',
    pdfUrl: '#',
    expiryDate: '2024-07-08', // This notice should be expired and not visible on the notice board
  },
];

const mockPhotos: Photo[] = [
  { id: 1, url: 'https://i.ibb.co/pwnL1b2/building-day.jpg', caption: 'দিনের আলোতে আমাদের ভবন।' },
  { id: 2, url: 'https://i.ibb.co/3cqdYfR/building-night.jpg', caption: 'রাতের আলোয় ভবনের সৌন্দর্য।' },
  { id: 3, url: 'https://i.ibb.co/M6g0P8Q/garden.jpg', caption: 'আমাদের ছোট্ট সবুজ বাগান।' },
  { id: 4, url: 'https://i.ibb.co/fDYn5yV/rooftop.jpg', caption: 'ভবনের ছাদ থেকে দেখা দৃশ্য।' },
  { id: 5, url: 'https://i.ibb.co/z5y3Wq3/entrance.jpg', caption: 'আমাদের ভবনের প্রবেশদ্বার।' },
  { id: 6, url: 'https://i.ibb.co/z5y3Wq3/entrance.jpg', caption: 'বার্ষিক আনন্দ উৎসবের মুহূর্ত।' },
];


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const storedNotices = localStorage.getItem('notices');
      if (storedNotices) {
        return JSON.parse(storedNotices);
      }
      const sortedMockNotices = [...mockNotices].sort((a, b) => new Date(b.publishDateTime).getTime() - new Date(a.publishDateTime).getTime());
      localStorage.setItem('notices', JSON.stringify(sortedMockNotices));
      return sortedMockNotices;
    } catch (error) {
      console.error("Failed to initialize notices from storage:", error);
      // Fallback to mock data if storage fails
      return [...mockNotices].sort((a, b) => new Date(b.publishDateTime).getTime() - new Date(a.publishDateTime).getTime());
    }
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    try {
      const storedPhotos = localStorage.getItem('photos');
      if (storedPhotos) {
        return JSON.parse(storedPhotos);
      }
      localStorage.setItem('photos', JSON.stringify(mockPhotos));
      return mockPhotos;
    } catch (error) {
      console.error("Failed to initialize photos from storage:", error);
      // Fallback to mock data if storage fails
      return mockPhotos;
    }
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Check Auth Status only
      const authStatus = sessionStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Failed to initialize auth status from storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('notices', JSON.stringify(notices));
    } catch (error) {
        console.error("Failed to save notices to localStorage:", error);
    }
  }, [notices]);

  useEffect(() => {
    try {
        localStorage.setItem('photos', JSON.stringify(photos));
    } catch (error) {
        console.error("Failed to save photos to localStorage:", error);
    }
  }, [photos]);


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

  // Notice Handlers
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    setNotices(prevNotices => {
        const newId = prevNotices.length > 0 ? Math.max(...prevNotices.map(n => n.id)) + 1 : 1;
        const newNotices = [{ ...notice, id: newId }, ...prevNotices];
        return newNotices.sort((a, b) => new Date(b.publishDateTime).getTime() - new Date(a.publishDateTime).getTime());
    });
  };

  const updateNotice = (updatedNotice: Notice) => {
    setNotices(prevNotices => {
      const newNotices = prevNotices.map(n => n.id === updatedNotice.id ? updatedNotice : n);
      return newNotices.sort((a, b) => new Date(b.publishDateTime).getTime() - new Date(a.publishDateTime).getTime());
    });
  };

  const deleteNotice = (id: number) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই নোটিশটি মুছে ফেলতে চান?')) {
        setNotices(prevNotices => prevNotices.filter(n => n.id !== id));
    }
  };

  // Photo Handlers
  const addPhoto = (photo: Omit<Photo, 'id'>) => {
    setPhotos(prevPhotos => {
      const newId = prevPhotos.length > 0 ? Math.max(...prevPhotos.map(p => p.id)) + 1 : 1;
      return [{ ...photo, id: newId }, ...prevPhotos];
    });
  };

  const deletePhoto = (id: number) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান?')) {
      setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== id));
    }
  };

  const renderPage = () => {
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