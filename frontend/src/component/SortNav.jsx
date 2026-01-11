import React, { useMemo } from 'react';

const SortNav = ({ products = [], sortBy, setSortBy, selectedType, setSelectedType }) => {
  // Get unique filter options from products
  const types = useMemo(() => {
    return [...new Set(products.map((p) => p.type))].filter(Boolean);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Sort
    let sorted = [...filtered];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [products, sortBy, selectedType]);

  return {
    filteredProducts,
    types,
    ui: (
    <nav className="w-full flex justify-center p-0">
      <div className="relative w-full h-9 md:h-14 flex items-center justify-start px-2 md:px-6 rounded-full ring-[#4169e1]/85 ring-2 backdrop-blur-md shadow-[0_-10px_20px_-12px_rgba(0,0,0,0.35)] bg-white/55 max-w-375">
        
        {/* Sort By and Type - Always in same line on left */}
        <div className="flex items-center justify-start gap-2 md:gap-6">
          {/* Sort By */}
          <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
            <label className="text-[10px] md:text-sm font-semibold text-black">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-1.5 py-0.5 md:px-3 md:py-2 border border-[#4169e1] rounded text-[10px] md:text-sm font-medium focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#4169e1] bg-white text-black transition-all duration-300"
            >
              <option value="popularity">Popular</option>
              <option value="price-low">Low Price</option>
              <option value="price-high">High Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-[#4169e1]/50"></div>

          {/* Type Filter */}
          {types.length > 0 && (
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <label className="text-[10px] md:text-sm font-semibold text-black">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-1.5 py-0.5 md:px-3 md:py-2 border border-[#4169e1] rounded text-[10px] md:text-sm font-medium focus:outline-none focus:ring-1 md:focus:ring-2 focus:ring-[#4169e1] bg-white text-black transition-all duration-300"
              >
                <option value="all">All</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </nav>
    )
  };
};

export default SortNav;
