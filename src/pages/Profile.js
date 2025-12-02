import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  MapPin,
  Shield,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Home,
  Briefcase,
  MapPinned,
  CheckCircle,
  AlertCircle,
  Copy,
  Lock,
  Save,
  X,
  ChevronRight,
} from 'lucide-react';

// Static list of Indian states/UTs for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });

  // Address data
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Pincode lookup state
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState('');

  // 2FA data
  const [twoFA, setTwoFA] = useState({
    enabled: false,
    secret: '',
    qrCode: '',
    token: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      });
      setTwoFA((prev) => ({ ...prev, enabled: user.twoFactorEnabled }));
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profile', profileData);
      toast.success('Profile updated successfully');
      loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // -------- Address logic --------

  const resetAddressForm = () => {
    setAddressForm({
      type: 'home',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    });
    setPinMessage('');
    setPinLoading(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        await api.put(`/users/address/${editingAddress}`, addressForm);
        toast.success('Address updated successfully');
      } else {
        await api.post('/users/address', addressForm);
        toast.success('Address added successfully');
      }

      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await api.delete(`/users/address/${addressId}`);
      toast.success('Address deleted successfully');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleAddressFieldChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleZipChange = (value) => {
    setAddressForm((prev) => ({ ...prev, zipCode: value }));
    setPinMessage('');

    // Only trigger lookup when we have a valid 6-digit Indian PIN
    if (/^\d{6}$/.test(value)) {
      lookupPincode(value);
    }
  };

  const lookupPincode = async (pincode) => {
    try {
      setPinLoading(true);
      setPinMessage('Fetching city & state for this pincode...');

      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (Array.isArray(data) && data[0]?.Status === 'Success') {
        const office = data[0].PostOffice?.[0];
        if (office) {
          setAddressForm((prev) => ({
            ...prev,
            city: office.District || prev.city,
            state: office.State || prev.state,
          }));
          setPinMessage('Location auto-filled from pincode.');
        } else {
          setPinMessage('Could not find location for this pincode.');
        }
      } else {
        setPinMessage('Invalid pincode or no data found.');
      }
    } catch (err) {
      console.error('Pincode lookup error:', err);
      setPinMessage('Failed to fetch location. Please fill manually.');
    } finally {
      setPinLoading(false);
    }
  };

  // -------- 2FA logic --------

  const handleSetup2FA = async () => {
    try {
      const res = await api.post('/auth/setup-2fa');
      setTwoFA((prev) => ({
        ...prev,
        secret: res.data.secret,
        qrCode: res.data.qrCode,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to setup 2FA');
    }
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();

    try {
      await api.post('/auth/enable-2fa', { token: twoFA.token });
      toast.success('2FA enabled successfully');
      setTwoFA((prev) => ({ ...prev, enabled: true, token: '' }));
      loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid token. Please try again.');
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable 2FA?')) {
      return;
    }

    try {
      await api.post('/auth/disable-2fa');
      toast.success('2FA disabled successfully');
      setTwoFA({ enabled: false, secret: '', qrCode: '', token: '' });
      loadUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home size={18} className="text-emerald-600" />;
      case 'work':
        return <Briefcase size={18} className="text-sky-600" />;
      default:
        return <MapPinned size={18} className="text-violet-600" />;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, description: 'Delivery locations' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Account protection' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <span className="text-lg font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase()}
                {user?.lastName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-xs text-slate-600 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Mobile Tab Selector */}
          <div className="mt-3">
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {React.createElement(tabs.find((t) => t.id === activeTab).icon, {
                  size: 20,
                  className: 'text-emerald-600',
                })}
                <span className="font-medium text-slate-900">
                  {tabs.find((t) => t.id === activeTab).label}
                </span>
              </div>
              <ChevronRight
                size={20}
                className={`text-slate-400 transition-transform ${
                  showMobileNav ? 'rotate-90' : ''
                }`}
              />
            </button>

            {showMobileNav && (
              <div className="mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isLast = idx === tabs.length - 1;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      } ${!isLast ? 'border-b border-slate-100' : ''}`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <div className="flex-1">
                        <div className="font-medium">{tab.label}</div>
                        <div
                          className={`text-xs ${
                            isActive ? 'text-emerald-100' : 'text-slate-500'
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md">
              <span className="text-2xl font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase()}
                {user?.lastName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage your account information, addresses and security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <div className="flex-1 text-left">
                          <div>{tab.label}</div>
                          <div
                            className={`text-xs font-normal ${
                              isActive ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* User Info Card */}
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="flex-shrink-0" />
                    <span>{user?.mobile}</span>
                  </div>
                  {user?.twoFactorEnabled && (
                    <div className="flex items-center gap-2 font-medium text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg">
                      <CheckCircle size={14} />
                      <span>2FA Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-600 px-4 sm:px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User size={22} />
                    Profile Information
                  </h2>
                  <p className="text-sm text-emerald-100 mt-1">
                    Update your personal details.
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate} className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="tel"
                        value={profileData.mobile}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Save size={18} />
                      {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-emerald-600 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <MapPin size={22} />
                        Saved Addresses
                      </h2>
                      <p className="text-sm text-emerald-100 mt-1">
                        Manage your delivery locations.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddress(null);
                        resetAddressForm();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-50 border border-emerald-100 transition-all"
                    >
                      <Plus size={18} />
                      Add Address
                    </button>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Address Form */}
                    {showAddressForm && (
                      <div className="mb-6 p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                              resetAddressForm();
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <X size={18} className="text-slate-500" />
                          </button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                          {/* Type */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address Type
                            </label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                              {['home', 'work', 'other'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() =>
                                    setAddressForm((prev) => ({ ...prev, type }))
                                  }
                                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize border transition-all ${
                                    addressForm.type === type
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                                  }`}
                                >
                                  {getAddressIcon(type)}
                                  <span className="hidden sm:inline">{type}</span>
                                  <span className="sm:hidden">{type[0]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Address lines */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address Line 1 *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.addressLine1}
                              onChange={(e) =>
                                handleAddressFieldChange('addressLine1', e.target.value)
                              }
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              placeholder="House / Flat No., Building Name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              value={addressForm.addressLine2}
                              onChange={(e) =>
                                handleAddressFieldChange('addressLine2', e.target.value)
                              }
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              placeholder="Street, Area, Landmark"
                            />
                          </div>

                          {/* City / State / Pincode / Country */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Pincode *
                              </label>
                              <input
                                type="text"
                                value={addressForm.zipCode}
                                onChange={(e) => handleZipChange(e.target.value)}
                                maxLength={6}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                placeholder="e.g. 600001"
                                required
                              />
                              {pinLoading && (
                                <p className="mt-1 text-xs text-slate-500">
                                  Fetching location details…
                                </p>
                              )}
                              {pinMessage && !pinLoading && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {pinMessage}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                City *
                              </label>
                              <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) =>
                                  handleAddressFieldChange('city', e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                State *
                              </label>
                              <select
                                value={addressForm.state}
                                onChange={(e) =>
                                  handleAddressFieldChange('state', e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                                required
                              >
                                <option value="">Select state</option>
                                {INDIAN_STATES.map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Country *
                              </label>
                              <input
                                type="text"
                                value={addressForm.country}
                                onChange={(e) =>
                                  handleAddressFieldChange('country', e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                required
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                              type="submit"
                              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all"
                              disabled={loading}
                            >
                              <Save size={18} />
                              {loading ? 'Saving...' : 'Save Address'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddressForm(false);
                                setEditingAddress(null);
                                resetAddressForm();
                              }}
                              className="px-6 py-2.5 bg-white border border-slate-200 text-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Address List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {addresses.length === 0 ? (
                        <div className="col-span-2 text-center py-10">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-3">
                            <MapPin size={28} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            No saved addresses yet.
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Add a delivery address to get started.
                          </p>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <div
                            key={address._id}
                            className="relative p-4 sm:p-5 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-slate-50 rounded-lg flex-shrink-0">
                                  {getAddressIcon(address.type)}
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-900 capitalize block text-sm sm:text-base">
                                    {address.type}
                                  </span>
                                  {address.isDefault && (
                                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium mt-1">
                                      <CheckCircle size={12} />
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingAddress(address._id);
                                    setAddressForm({
                                      type: address.type,
                                      addressLine1: address.addressLine1 || '',
                                      addressLine2: address.addressLine2 || '',
                                      city: address.city || '',
                                      state: address.state || '',
                                      zipCode: address.zipCode || '',
                                      country: address.country || 'India',
                                    });
                                    setShowAddressForm(true);
                                    setPinMessage('');
                                  }}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Edit address"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(address._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete address"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                              <p className="font-medium text-slate-900">
                                {address.addressLine1}
                              </p>
                              {address.addressLine2 && <p>{address.addressLine2}</p>}
                              <p>
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                              <p className="text-slate-500">{address.country}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-600 px-4 sm:px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Shield size={22} />
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm text-emerald-100 mt-1">
                    Add an extra layer of security to your account.
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  {!twoFA.enabled ? (
                    <>
                      {!twoFA.secret ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4">
                            <AlertCircle size={32} className="text-amber-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Enable Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
                            Keep your account more secure by requiring a one-time code from
                            an authenticator app when you sign in.
                          </p>
                          <button
                            onClick={handleSetup2FA}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition-all"
                          >
                            <Lock size={18} />
                            Setup 2FA
                          </button>
                        </div>
                      ) : (
                        <div className="max-w-2xl mx-auto space-y-6">
                          {/* Step 1 */}
                          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                              Step 1: Scan QR code in your authenticator app
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                              Use apps like Google Authenticator, Microsoft Authenticator, or
                              Authy to scan this QR code.
                            </p>
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-white rounded-xl border border-slate-200">
                                <QRCodeSVG value={twoFA.qrCode} size={220} />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                              <p className="text-xs text-slate-600 mb-2">
                                Or enter this code manually in your app:
                              </p>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <code className="flex-1 bg-slate-100 px-3 py-2 rounded-md font-mono text-xs text-slate-900 break-all">
                                  {twoFA.secret}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(twoFA.secret)}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50"
                                >
                                  <Copy size={14} />
                                  Copy
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <form onSubmit={handleEnable2FA}>
                            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                                Step 2: Enter the 6-digit code
                              </h3>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Code from your authenticator app
                              </label>
                              <input
                                type="text"
                                maxLength={6}
                                value={twoFA.token}
                                onChange={(e) =>
                                  setTwoFA((prev) => ({
                                    ...prev,
                                    token: e.target.value,
                                  }))
                                }
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-xl font-mono tracking-[0.5em]"
                                placeholder="000000"
                                required
                              />
                              <button
                                type="submit"
                                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition-all"
                              >
                                <CheckCircle size={18} />
                                Enable 2FA
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                        <CheckCircle size={32} className="text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Two-Factor Authentication is enabled
                      </h3>
                      <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
                        You will be asked for a one-time code from your authenticator app
                        when signing in.
                      </p>
                      <button
                        onClick={handleDisable2FA}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all"
                      >
                        <Lock size={18} />
                        Disable 2FA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
