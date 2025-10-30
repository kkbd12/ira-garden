import React, { useState } from 'react';
import type { Photo } from '../types';
import Card from './Card';
import XIcon from './icons/XIcon';

const GalleryPage: React.FC<{ photos: Photo[] }> = ({ photos }) => {
    const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

    const openModal = (photo: Photo) => {
        setSelectedImage(photo);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
                ফটো গ্যালারী
            </h2>

            {photos.length > 0 ? (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                    {photos.map((photo) => (
                        <Card 
                            key={photo.id} 
                            className="group cursor-pointer overflow-hidden transform transition-transform hover:scale-105 mb-4 break-inside-avoid"
                            onClick={() => openModal(photo)}
                        >
                            <div className="relative bg-gray-200">
                                <img 
                                    src={photo.url} 
                                    alt={photo.caption} 
                                    className="w-full h-auto block"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
                                     <p className="text-white text-sm font-semibold truncate">{photo.caption}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center p-6">
                    <p className="text-gray-600">গ্যালারীতে কোনো ছবি পাওয়া যায়নি।</p>
                </Card>
            )}

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="image-modal-caption"
                >
                    <div 
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 flex-grow overflow-auto flex items-center justify-center">
                            <img 
                                src={selectedImage.url} 
                                alt={selectedImage.caption} 
                                className="max-w-full max-h-full object-contain rounded-md"
                            />
                        </div>
                        
                        {selectedImage.caption && (
                            <div className="p-4 bg-gray-50 border-t text-center rounded-b-lg">
                                <p id="image-modal-caption" className="text-gray-800 text-lg font-medium">{selectedImage.caption}</p>
                            </div>
                        )}

                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 bg-white/70 rounded-full p-1.5 hover:bg-white hover:text-gray-900 transition-all duration-200"
                            aria-label="Close image view"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;