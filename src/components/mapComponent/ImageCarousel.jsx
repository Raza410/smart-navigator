import React, { useState } from 'react';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    // Early return if no images are available
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button onClick={goToPrevious} className="absolute left-0 p-2 transform -translate-y-1/2 bg-gray-200 rounded-full top-1/2">
                &#10094; {/* Left arrow */}
            </button>

            <div className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <img
                    src={images[currentIndex]} // Directly using images[currentIndex]
                    alt={`Building image ${currentIndex + 1}`}
                    className="object-cover w-full h-full"
                />
            </div>

            <button onClick={goToNext} className="absolute right-0 p-2 transform -translate-y-1/2 bg-gray-200 rounded-full top-1/2">
                &#10095; {/* Right arrow */}
            </button>

            <div className="flex justify-center mt-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 mx-1 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
