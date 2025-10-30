import React from 'react';
import Card from './Card';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <div className="text-center p-6">
          <h2 className="text-3xl font-bold text-teal-700 mb-2">
            ইরা গার্ডেন-এ আপনাকে স্বাগতম
          </h2>
          <p className="text-lg text-gray-600">
            আমাদের কমিউনিটিতে একটি সুন্দর এবং নিরাপদ জীবনযাপন করুন।
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card>
            <img 
              src="https://i.ibb.co/h1fzcGCW/0641318031d3bc8bf0bc3f25e699d9a3.jpg" 
              alt="ইরা গার্ডেন ভবন" 
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-teal-200 pb-2">আমাদের সম্পর্কে</h3>
            <p className="text-gray-600 leading-relaxed">
              আমাদের এই বাড়ির যাত্রা শুরু হয়েছিল ১৯৮৩ সালে, যখন আমাদের বাবা এই জমিটি কিনেছিলেন। তখনকার নন্দীপাড়া ছিল এক শান্ত, গ্রামীণ পরিবেশ। বড় রাস্তাঘাট ছিল না, চারিদিকে ছিল সবুজের ছোঁয়া। সেই সুন্দর পরিবেশে টিনের একটি ঘরে আমাদের স্বপ্নের শুরু হয়েছিল।
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              বাবার সেই স্বপ্নকে বাস্তবে রূপ দিতে ২০১৫ সালে আমরা পাঁচ ভাই মিলে পুরোনো টিনের ঘরের জায়গায় এই নতুন ভবনটি প্রতিষ্ঠা করি। এটি শুধু একটি দালান নয়, এটি আমাদের পরিবারের একতা, শ্রম এবং ভালোবাসার প্রতীক।
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
               ২০১৮ সালে আমাদের বাবা এই বাড়িতেই শেষ নিঃশ্বাস ত্যাগ করেন। তাঁর স্মৃতি এবং আমাদের মায়ের প্রতি শ্রদ্ধা জানিয়ে, তাঁদের দুজনের নাম মিলিয়েই এই বাড়ির নাম রাখা হয়েছে 'ইরা গার্ডেন'। এই বাড়িটি কেবল ইট-পাথরের একটি কাঠামো নয়, এটি আমাদের বাবা-মায়ের ভালোবাসা এবং আমাদের পরিবারের ঐতিহ্যের স্মারক।
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;