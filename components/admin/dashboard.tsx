"use client";
import React from "react";
import { motion } from "motion/react";
import { Shield, Building, Users, UserCog, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard({ user }: { user?: any }) {
  const stats = [
    {
      name: "Total Hostels",
      value: "24",
      change: "+3 this week",
      icon: <Building className="w-6 h-6" />,
      color: "bg-blue-500",
      href: "/admin/hostels"
    },
    {
      name: "Student Accounts", 
      value: "156",
      change: "+12 this week",
      icon: <Users className="w-6 h-6" />,
      color: "bg-green-500",
      href: "/admin/students"
    },
    {
      name: "Pending Applications",
      value: "7",
      change: "2 urgent",
      icon: <Eye className="w-6 h-6" />,
      color: "bg-orange-500",
      href: "/admin/hostels"
    },
    {
      name: "Admin Accounts",
      value: "3",
      change: "All active",
      icon: <UserCog className="w-6 h-6" />,
      color: "bg-purple-500",
      href: "/admin/admins"
    },
  ];

  const recentActivities = [
    {
      type: "hostel",
      message: "New hostel application submitted by Golden View Hostel",
      time: "2 hours ago",
      status: "pending"
    },
    {
      type: "student",
      message: "New student registration: John Doe",
      time: "4 hours ago", 
      status: "completed"
    },
    {
      type: "hostel",
      message: "Emerald Heights hostel updated their information",
      time: "1 day ago",
      status: "completed"
    },
    {
      type: "admin",
      message: "Admin login: Robinson Goodness",
      time: "2 days ago",
      status: "completed"
    },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "Admin"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with CribPal today.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={stat.href} className="block">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <Link
              href="/admin/hostels"
              className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
            >
              <Building className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-900">
                  Review Hostel Applications
                </p>
                <p className="text-sm text-gray-500">7 pending applications</p>
              </div>
            </Link>
            
            <Link
              href="/admin/students"
              className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition group"
            >
              <Users className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-green-900">
                  Manage Student Accounts
                </p>
                <p className="text-sm text-gray-500">156 active students</p>
              </div>
            </Link>
            
            <Link
              href="/admin/admins"
              className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
            >
              <UserCog className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-purple-900">
                  Admin Management
                </p>
                <p className="text-sm text-gray-500">Manage admin accounts</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'pending' ? 'bg-orange-400' : 'bg-green-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/activity"
            className="block text-center mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            View all activity →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
