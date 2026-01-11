import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../redux/authActions';
import SearchBar from "./SearchBar";
import Logbtn from "./Logbtn";
import LogoutBtn from "./LogoutBtn";
import cartLogo from "../assets/cart.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = user?.isAdmin || user?.role === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
    closeMenu();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom NavLink content
  const NavItem = ({ to, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center transition-all duration-300 px-2 ${
          isActive ? "text-black font-extrabold text-lg" : "text-black hover:text-[#111111]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="mr-1 font-black text-2xl leading-none text-[#4169e1]">
              &lt;
            </span>
          )}
          {isActive ? <span className="font-extrabold text-lg">{label}</span> : label}
          {isActive && (
            <span className="ml-1 font-black text-2xl leading-none text-[#4169e1]">
              &gt;
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>


  <nav className="fixed z-60 w-[95vw] min-w-90 max-w-360 h-16 flex items-center justify-between px-6 mt-2 top-0 left-1/2 -translate-x-1/2 rounded-full ring-[#4169e1]/85 ring-2 backdrop-blur-md shadow-[0_10px_25px_-12px_rgba(0,0,0,0.22)] bg-white/25 text-black">
        
        {/* LEFT: Search (Mobile) / Brand (Desktop) */}
        <div className="flex items-center w-1/4">
          <button
            onClick={toggleSearch}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/70 hover:bg-white/90 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <div className="hidden md:flex items-center bg-white/65 border border-[#4169e1]/55 rounded-full pl-1 pr-6 py-1">
            {cartLogo ? (
              <img src={cartLogo} alt="Cartify" className="w-10 h-10" />
            ) : null}
            <span className="ml-3 text-2xl font-extrabold tracking-tight text-[#4169e1]">Cartify</span>
          </div>
        </div>

        {/* CENTER: Brand (Mobile) / NavLinks (Desktop) */}
        <div className="flex items-center justify-center grow">
          <div className="flex md:hidden items-center bg-white/65 border border-[#4169e1]/55 rounded-full pl-2 pr-4 py-1 max-w-55 w-full overflow-hidden">
            {cartLogo ? (
              <img src={cartLogo} alt="Cartify" className="w-8 h-8 shrink-0" />
            ) : null}
            <span className="ml-2 text-2xl font-extrabold tracking-tight truncate text-[#4169e1]">Cartify</span>
          </div>

          <ul className="hidden md:flex items-center gap-x-4 lg:gap-x-8">
            <li><NavItem to="/" label="Home" /></li>
            <li>
              <div className="relative">
                <NavItem to="/cart" label="Cart" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </li>
            <li><NavItem to="/profile" label="Profile" /></li>
            <li>
              {isLoggedIn ? (
                <LogoutBtn onClick={handleLogout} />
              ) : (
                <NavLink to="/login">
                  <Logbtn className="btn-3 text-black! w-50 h-9 rounded-xl" isLoading={false} status={null}>
                    Login
                  </Logbtn>
                </NavLink>
              )}
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE: Hamburger (Mobile) / Search (Desktop) */}
        <div className="flex items-center justify-end w-1/4">
          <button
            onClick={toggleSearch}
            className="hidden md:inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#4169e1]/60 bg-white/70 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button type="button" className="md:hidden relative z-70 p-1 text-black" onClick={toggleMenu}>
            {menuOpen ? (
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" d="M5 5l14 14M19 5L5 19" />
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 24 24">
                <path fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h12M4 17h10" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-55 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/25 backdrop-blur-md" onClick={closeMenu} />
        <div className={`absolute top-21.25 left-1/2 -translate-x-1/2 w-[92vw] bg-white/85 text-black border border-black/10 rounded-4xl p-8 shadow-2xl transition-all duration-300 ${menuOpen ? "translate-y-0 scale-100" : "-translate-y-10 scale-95"}`}>
          <ul className="flex flex-col items-center gap-6">
            <li className="w-full flex justify-center"><NavItem to="/" label="Home" onClick={closeMenu} /></li>
            <li className="w-full flex justify-center">
              <div className="relative">
                <NavItem to="/cart" label="Cart" onClick={closeMenu} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </li>
            <li className="w-full flex justify-center"><NavItem to="/profile" label="Profile" onClick={closeMenu} /></li>
            <li className="w-full flex justify-center">
              {isLoggedIn ? (
                <LogoutBtn onClick={handleLogout} />
              ) : (
                <NavLink to="/login" onClick={closeMenu}>
                  <Logbtn className="btn-3 text-black! w-50 h-9 rounded-xl" isLoading={false} status={null}>
                    Login
                  </Logbtn>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* SEARCH BAR */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;