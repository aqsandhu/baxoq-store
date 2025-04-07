import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../slices/authSlice'
import { RootState, AppDispatch } from '../../store'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { cartItems } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>()
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  const handleLogout = () => {
    dispatch(logout());
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-md dark:from-black dark:to-gray-900 border-b border-secondary/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-cinzel font-bold text-secondary">
              <span className="text-primary">Baxoq</span>.Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-secondary font-cinzel tracking-wide">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-secondary font-cinzel tracking-wide">
              Products
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-secondary font-cinzel tracking-wide">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-secondary font-cinzel tracking-wide">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-300 hover:text-secondary"
                >
                  <span className="mr-1">{user?.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10">
                    {user?.isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-secondary"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-secondary"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-secondary"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-secondary"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </>
            )}
            <Link to="/cart" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 hover:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block text-gray-300 hover:text-secondary font-cinzel">
              Home
            </Link>
            <Link to="/products" className="block text-gray-300 hover:text-secondary font-cinzel">
              Products
            </Link>
            <Link to="/about" className="block text-gray-300 hover:text-secondary font-cinzel">
              About Us
            </Link>
            <Link to="/contact" className="block text-gray-300 hover:text-secondary font-cinzel">
              Contact
            </Link>
            
            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <div className="font-medium text-gray-300">
                  {user?.name}
                </div>
                
                {user?.isAdmin && (
                  <Link to="/admin" className="block text-gray-300 hover:text-secondary">
                    Admin Dashboard
                  </Link>
                )}
                
                <Link to="/profile" className="block text-gray-300 hover:text-secondary">
                  My Profile
                </Link>
                <Link to="/orders" className="block text-gray-300 hover:text-secondary">
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-gray-300 hover:text-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-700 flex justify-between">
                <Link to="/login" className="text-gray-300 hover:text-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
