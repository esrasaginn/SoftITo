import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { LogOut, User, Ticket } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-150 group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
            BiletiniAl
          </span>
        </Link>

        {/* Navigation / User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User Greeting */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50 text-indigo-950 text-sm font-medium">
                <User size={16} className="text-indigo-600" />
                <span>{user.name}</span>
              </div>

              {/* Bookings shortcut */}
              <Link
                to="/receipt"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/40 rounded-xl transition-all"
              >
                <Ticket size={16} />
                <span>Biletlerim</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                type="button"
                id="logoutBtn"
              >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                id="navLoginBtn"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                id="navRegisterBtn"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
