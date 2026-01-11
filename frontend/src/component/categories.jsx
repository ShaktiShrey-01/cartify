import './categories.css';
import { Link } from 'react-router-dom';
const electronicsImage = new URL('../assets/e.png', import.meta.url).href;
const groceryImage = new URL('../assets/g.png', import.meta.url).href;
const clothingImage = new URL('../assets/c.png', import.meta.url).href;

const Categories = () => {
  const categories = [
    { id: 1, name: 'Electronics', path: '/electronics', image: electronicsImage },
    { id: 2, name: 'Grocery', path: '/grocery', image: groceryImage },
    { id: 3, name: 'Clothing', path: '/clothing', image: clothingImage },
  ];

  return (
    <section className="w-full pt-2 md:pt-3 pb-8 md:pb-12 min-h-[24rem] md:min-h-[30rem]">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm text-center -mt-1 md:-mt-2 mb-1 md:mb-2 px-2">Shop by Category</h2>
      <div className="overflow-x-auto pt-6 md:pt-8 pb-8 scrollbar-hide max-w-6xl mx-auto">
        <div className="flex gap-12 md:gap-24 px-4 min-w-max justify-center">
          {categories.map((category) => (
            <Link key={category.id} to={category.path} className="shrink-0 group">
              <div className="category-card circle-border-fill relative w-44 h-44 md:w-72 md:h-72 rounded-full overflow-hidden shadow-lg hover:shadow-2xl float-soft transform transition-transform duration-[700ms] ease-out group-hover:scale-[1.08] cursor-pointer">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[700ms] ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors duration-[700ms] ease-out"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white group-hover:scale-110 transition-transform duration-[700ms] ease-out">
                    <h3 className="text-xl md:text-3xl font-bold drop-shadow-lg">{category.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
