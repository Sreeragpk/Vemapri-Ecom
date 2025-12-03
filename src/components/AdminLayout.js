import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.webp';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  Search,
  Store,
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'subadmin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', exact: true },
    { icon: Users, label: 'Users', path: '/admin/users' },
    {
      icon: Package,
      label: 'Products',
      path: '/admin/products',
      adminOnly: true,
    },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  const isActive = (itemPath, exact) => {
    if (exact) return location.pathname === itemPath;
    return location.pathname.startsWith(itemPath);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/products')) return 'Product Management';
    if (path.includes('/orders')) return 'Order Management';
    return 'Admin Panel';
  };

  const SidebarContent = (
    <>
      {/* Brand Header with Logo */}
      <div className="h-20 px-6 flex items-center justify-center border-b border-slate-800 bg-slate-950/70">
        <Link
          to="/admin"
          className="flex items-center gap-4 group w-full py-3"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="relative flex-shrink-0">
            <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/40 group-hover:shadow-black/60 transition-all duration-200 overflow-hidden p-2">
              <img
                src={logo}
                alt="Vemapri Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <span className="hidden text-2xl font-bold text-slate-900 items-center justify-center h-full w-full">
                V
              </span>
            </div>
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-slate-100 rounded-full border-2 border-slate-950" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold text-slate-50 tracking-tight truncate">
              Vemapri
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="mb-2 px-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </span>
        </div>
        {filteredMenuItems.map((item, index) => {
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-slate-50 text-slate-900 shadow-lg shadow-black/30'
                  : 'text-slate-300 hover:bg-slate-900/60 hover:text-slate-50'
              }`}
            >
              <div className="flex items-center">
                <item.icon
                  size={20}
                  className={`mr-3 ${
                    active
                      ? 'text-slate-900'
                      : 'text-slate-400 group-hover:text-slate-100'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span>{item.label}</span>
              </div>
              {active && (
                <ChevronRight size={16} className="text-slate-700/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-900/70 p-3 border border-slate-800">
            <div className="relative flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-black to-slate-700 text-slate-50 font-bold text-sm shadow-md">
                {(user.firstName?.[0] || 'U').toUpperCase()}
                {(user.lastName?.[0] || '').toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-slate-100 rounded-full border-2 border-slate-950" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-50 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-400">
                {user.role === 'admin' ? 'Administrator' : 'Sub Admin'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-red-600/10 hover:text-red-400 border border-slate-800 hover:border-red-500/50 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  // Top tab-style nav (small icon tabs) using the same menuItems
  const TopTabs = () => (
    <nav className="mt-2 hidden lg:flex items-center gap-2">
      {filteredMenuItems.map((item, index) => {
        const active = isActive(item.path, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={index}
            to={item.path}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              active
                ? 'bg-slate-900 text-slate-50 border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon size={14} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-black via-slate-950 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-slate-50 p-2 rounded-lg hover:bg-slate-800 transition-colors z-10"
        >
          <X size={20} />
        </button>
        {SidebarContent}
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex h-11 items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                  <Menu size={20} />
                </button>

                {/* Logo in Header (mobile) */}
                <div className="lg:hidden flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-1.5 shadow-sm">
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="hidden text-base font-bold text-slate-900">
                      V
                    </span>
                  </div>
                  <span className="text-base font-bold text-slate-900">
                    Vemapri
                  </span>
                </div>

                <div className="hidden lg:flex flex-col">
                  <h1 className="text-lg font-semibold text-slate-900">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Welcome back, {user?.firstName}.
                  </p>
                </div>

                <div className="lg:hidden flex flex-col">
                  <h1 className="text-sm font-semibold text-slate-900">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search */}
                <button className="hidden md:inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs sm:text-sm text-slate-600 hover:bg-slate-200 transition-colors">
                  <Search size={15} />
                  <span className="hidden lg:inline">Search…</span>
                </button>

                {/* Notifications */}
                <button className="relative inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Settings */}
                <button className="hidden sm:inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                  <Settings size={18} />
                </button>

                {/* View Store */}
                <Link
                  to="/"
                  className="hidden md:inline-flex items-center gap-2 rounded-lg bg-black px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-50 hover:bg-slate-900 transition-colors shadow-sm hover:shadow-md"
                >
                  <Store size={16} />
                  <span>View Store</span>
                </Link>

                {/* Mobile User Avatar */}
                <div className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-black to-slate-700 text-slate-50 font-bold text-xs shadow-md">
                  {(user?.firstName?.[0] || 'U').toUpperCase()}
                </div>

                {/* Desktop User */}
                <div className="hidden sm:flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 hover:bg-slate-100 transition-colors cursor-default">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-black to-slate-700 text-slate-50 font-bold text-xs shadow-md">
                    {(user?.firstName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {user?.role === 'admin' ? 'Administrator' : 'Sub Admin'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top icon tabs */}
            <TopTabs />
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
