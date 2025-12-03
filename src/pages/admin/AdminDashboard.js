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
      // parallel fetch
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users?limit=1'),
        api.get('/products?limit=1'),
        api.get('/orders/all?limit=5'),
      ]);

      // Normalize data returned by backend
      const recentOrders = ordersRes?.data?.items ?? [];
      const totalOrders = ordersRes?.data?.meta?.total ?? 0;

      // compute revenue from recent orders (or 0)
      const totalRevenue = Array.isArray(recentOrders)
        ? recentOrders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0)
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
      // keep defaults if error
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      accent: 'from-emerald-500 to-emerald-400',
      light: 'bg-emerald-50 text-emerald-700',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      accent: 'from-lime-500 to-emerald-400',
      light: 'bg-lime-50 text-lime-700',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      accent: 'from-amber-500 to-lime-400',
      light: 'bg-amber-50 text-amber-700',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      accent: 'from-emerald-600 to-emerald-400',
      light: 'bg-emerald-50 text-emerald-700',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-7 w-40 bg-emerald-100 rounded-full animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white/60 border border-emerald-100 shadow-sm animate-pulse"
              />
            ))}
          </div>
          <div className="h-80 rounded-2xl bg-white/60 border border-emerald-100 shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quick snapshot of Vemapri store performance.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs text-emerald-700 shadow-sm">
          <TrendingUp size={16} className="mr-1 text-emerald-500" />
          <span className="font-medium">Live</span>
          <span className="mx-1 text-slate-300">•</span>
          <span className="text-slate-500">Admin Dashboard</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="group relative overflow-hidden rounded-2xl bg-white/90 border border-emerald-100/70 shadow-sm hover:shadow-lg hover:border-emerald-300/80 transition-all"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 -top-6 h-16 bg-gradient-to-r ${stat.accent} opacity-10`}
              />
              <div className="relative flex items-start justify-between p-4 sm:p-5">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-slate-400 group-hover:text-slate-500">
                    View detailed {stat.title.toLowerCase()}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-inner ${stat.light} border-white/60`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section: Recent Orders */}
      <div className="rounded-2xl bg-white/90 border border-emerald-100/80 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-emerald-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              Recent Orders
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                {stats.recentOrders.length} latest
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Track the latest activity happening on your grocery store.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs sm:text-sm font-medium text-emerald-700 hover:text-emerald-800 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1 shadow-sm hover:shadow-md transition-all"
          >
            View all orders
          </Link>
        </div>

        {(!Array.isArray(stats.recentOrders) || stats.recentOrders.length === 0) ? (
          <div className="px-4 sm:px-6 py-10 text-center text-slate-400 text-sm">
            No orders found yet. Once customers place orders, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-50 text-sm">
              <thead className="bg-emerald-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 tracking-wider uppercase text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-emerald-50">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-emerald-50/60 transition-colors"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-[13px] font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        {order.orderNumber ?? '—'}
                      </Link>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-[13px] text-slate-700">
                      {order.user?.firstName ?? ''} {order.user?.lastName ?? ''}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-[13px] text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-current" />
                        {order.orderStatus ?? 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-[13px] font-semibold text-slate-900">
                      ₹{Number(order.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
