const Loader = ({ type = 'card', count = 5 }) => {
  if (type === 'card') {
    return (
      <div className="flex gap-4 md:gap-6 px-2 min-w-max animate-pulse">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-45 md:w-60 shrink-0 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
          >
            {/* Image Skeleton */}
            <div className="w-full h-45 md:h-55 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-4 md:p-5 space-y-3">
              {/* Title */}
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>

              {/* Price */}
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>

              {/* Button */}
              <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full animate-pulse">
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-3 p-3">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-14"></div>
              <div className="h-3 bg-gray-200 rounded w-16 justify-self-end"></div>
            </div>
          </div>

          <div>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                <div className="grid grid-cols-4 gap-3 p-3 items-center">
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="flex gap-2 justify-end">
                    <div className="h-6 bg-gray-200 rounded-lg w-14"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-14"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="relative w-[90vw] max-w-300 h-50 md:h-70 mx-auto md:-mt-16 overflow-hidden rounded-2xl border border-black/5 bg-gray-200 shadow-md animate-pulse">
        <div className="w-full h-full bg-gray-300"></div>
        
        {/* Dots skeleton */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-gray-400"></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Loader;
