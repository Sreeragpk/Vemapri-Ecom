// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  IndianRupee,
  Activity,
  BarChart3,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Package2,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users?limit=1'),
        api.get('/products?limit=1'),
        api.get('/orders/all?limit=5'),
      ]);

      const recentOrders = ordersRes?.data?.items ?? [];
      const totalOrders = ordersRes?.data?.meta?.total ?? 0;

      const totalRevenue = Array.isArray(recentOrders)
        ? recentOrders.reduce(
            (sum, order) => sum + (Number(order.totalPrice) || 0),
            0
          )
        : 0;

      setStats({
        totalUsers: usersRes?.data?.totalUsers ?? 0,
        totalProducts: productsRes?.data?.totalProducts ?? 0,
        totalOrders,
        totalRevenue,
        recentOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-violet-600 to-indigo-600',
      bgGradient: 'from-violet-50 to-indigo-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-500',
      link: '/admin/users',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-emerald-600 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      link: '/admin/products',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      gradient: 'from-amber-600 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      link: '/admin/orders',
      trend: '+23.1%',
      trendUp: true,
    },
    {
      title: 'Total Revenue',
      value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      gradient: 'from-rose-600 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      link: '/admin/orders',
      trend: '+18.7%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Animated Header Skeleton */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-indigo-500/5 to-slate-900/5 blur-3xl" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 w-64 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl animate-pulse" />
                      <div className="h-4 w-96 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="h-10 w-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse" />
                  <div className="h-10 w-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Animated Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 animate-pulse" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="h-3 w-24 bg-slate-200 rounded-full animate-pulse" />
                        <div className="h-8 w-32 bg-slate-300 rounded-lg animate-pulse" />
                        <div className="h-3 w-20 bg-slate-100 rounded-full animate-pulse" />
                      </div>
                      <div className="h-12 w-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent animate-pulse" />
                </div>
              ))}
            </div>

            {/* Animated Quick Stats Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-28 bg-slate-200 rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-slate-300 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Table Skeleton */}
            <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-6 w-40 bg-slate-300 rounded-lg animate-pulse" />
                    <div className="h-3 w-64 bg-slate-200 rounded-full animate-pulse" />
                  </div>
                  <div className="h-9 w-32 bg-slate-200 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-transparent animate-pulse"
                  >
                    <div className="h-12 w-12 bg-slate-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle2,
          class: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50',
          dotClass: 'bg-emerald-500',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          class: 'bg-rose-500/10 text-rose-700 border-rose-200/50',
          dotClass: 'bg-rose-500',
        };
      case 'processing':
        return {
          icon: Package2,
          class: 'bg-blue-500/10 text-blue-700 border-blue-200/50',
          dotClass: 'bg-blue-500',
        };
      default:
        return {
          icon: Clock,
          class: 'bg-amber-500/10 text-amber-700 border-amber-200/50',
          dotClass: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-indigo-500/5 to-slate-900/5 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center shadow-xl shadow-slate-900/20 border border-white/10">
                  <span className="text-xl font-bold tracking-wider text-white">
                    VA
                  </span>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Real-time analytics and insights for Vemapri Store
                </p>
              </div>
            </div>

            <div className="flex lg:inline-flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-slate-700 shadow-lg shadow-slate-200/50">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
                  <TrendingUp size={14} />
                </div>
                <span className="font-semibold">Live</span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="text-slate-500">Analytics</span>
              </div>
              <button className="flex items-center justify-center h-10 w-10 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-105 transition-all">
                <BarChart3 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`}
                />

                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} shadow-lg text-white group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <TrendingUp size={14} />
                      <span>{stat.trend}</span>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                </div>

                {/* Bottom Accent */}
                <div
                  className={`h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                />
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Today
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  In Stock
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Processing
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.recentOrders.filter(
                    (o) => o.orderStatus === 'processing'
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Orders */}
        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-3">
                  Recent Orders
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-lg">
                    {stats.recentOrders.length} latest
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Monitor latest transactions and order statuses
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 hover:text-black rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:scale-105 transition-all"
              >
                View All
                <ArrowUpRight size={14} className="sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          {(!Array.isArray(stats.recentOrders) ||
            stats.recentOrders.length === 0) && (
            <div className="px-6 py-16 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
                <ShoppingBag className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">
                No orders found yet. Orders will appear here once customers make
                purchases.
              </p>
            </div>
          )}

          {Array.isArray(stats.recentOrders) &&
            stats.recentOrders.length > 0 && (
              <>
                {/* Mobile: card list */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {stats.recentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.orderStatus);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Link
                        key={order._id}
                        to={`/admin/orders/${order._id}`}
                        className="px-4 py-3 flex flex-col gap-3 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <ShoppingBag
                                size={18}
                                className="text-slate-600"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                #{order.orderNumber ?? '—'}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {order.items?.length ?? 0} items
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            ₹{Number(order.totalPrice || 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                              {(order.user?.firstName?.[0] ?? 'U')
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-900">
                                {order.user?.firstName ?? ''}{' '}
                                {order.user?.lastName ?? ''}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                                {order.user?.email ?? '—'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${statusConfig.class}`}
                            >
                              <StatusIcon size={12} />
                              {order.orderStatus ?? 'pending'}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock size={12} className="text-slate-400" />
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    }
                                  )
                                : '—'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Desktop / tablet: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-gradient-to-r from-slate-50 to-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {stats.recentOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.orderStatus);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr
                            key={order._id}
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                to={`/admin/orders/${order._id}`}
                                className="flex items-center gap-3 group/link"
                              >
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover/link:from-indigo-100 group-hover/link:to-indigo-200 transition-colors">
                                  <ShoppingBag
                                    size={18}
                                    className="text-slate-600 group-hover/link:text-indigo-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 group-hover/link:text-indigo-600">
                                    #{order.orderNumber ?? '—'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {order.items?.length ?? 0} items
                                  </p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                  {(order.user?.firstName?.[0] ?? 'U')
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {order.user?.firstName ?? ''}{' '}
                                    {order.user?.lastName ?? ''}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {order.user?.email ?? '—'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock size={14} className="text-slate-400" />
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.class}`}
                              >
                                <StatusIcon size={14} />
                                {order.orderStatus ?? 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <p className="text-sm font-bold text-slate-900">
                                ₹{Number(order.totalPrice || 0).toLocaleString()}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AdminDashboard;
