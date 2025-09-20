"use client";
import React, { useState } from "react";
import {
  Home,
  BarChart3,
  Users,
  Clock,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Zap,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileModal from "@/components/ProfileModal";
import AuthGuard from "@/components/AuthGuard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearCredentials, clearAuthCookie } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import PublicRouteGuard from "@/components/PublicRouteGuard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("View all");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, fullName } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    clearAuthCookie();
    router.push("/login");
  };

  const transactions = [
    {
      id: "JR0001",
      date: "Jan 6, 2025",
      status: "Paid",
      amount: "R 3500.90",
      type: "Savings Deposit",
    },
    {
      id: "JR0001",
      date: "Jan 6, 2025",
      status: "Paid",
      amount: "R 3500.90",
      type: "Savings Deposit",
    },
    {
      id: "JR0001",
      date: "Jan 6, 2025",
      status: "Paid",
      amount: "R 3500.90",
      type: "Savings Deposit",
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="mb-6 mt-6 ">
            <img
              src="/logo-svg.svg"
              alt="JanRich Logo"
              className="mx-auto w-12 h-auto"
            />
          </div>

          <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-900 bg-gray-100 rounded-lg"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span>Community</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Clock className="w-5 h-5" />
                <span>History</span>
              </a>
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </a>
            <a
              href="#"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 px-3 py-2 mt-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {fullName || user || "User"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {fullName || user || "User"}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input className="pl-10 w-64" placeholder="Search" />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Customize</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Savings Breakdown Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Savings breakdown
                    </h2>
                    <p className="text-sm text-gray-600">
                      Keep track of your savings and interest earned.
                    </p>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                {/* Chart Area */}
                <div className="h-64 flex items-end justify-between space-x-2 mb-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "60px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Jan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "80px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Feb</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "100px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Mar</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "120px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Apr</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "90px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">May</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "110px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Jun</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "95px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Jul</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "105px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Aug</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "85px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Sep</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "75px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Oct</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "65px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Nov</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gray-200 rounded-t"
                      style={{ height: "70px" }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Dec</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View full report
                  </Button>
                </div>
              </div>

              {/* Keep it up Card */}
              <div className="bg-white rounded-lg border border-blue-200 p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Keep it up
                  </h2>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                {/* Circular Progress */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="40, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          40%
                        </div>
                        <div className="text-xs text-gray-600">
                          Savings goal
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">
                    10%
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    You've almost reached your goal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Save R 12 500 by November 2025 to meet your savings goal.
                  </p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Upgrade plan</span>
                </Button>
              </div>
            </div>

            {/* Vendor Movements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Transactions
                    </h2>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                      240 Transaction
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep track of your transactions.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input className="pl-10 w-64" placeholder="Search" />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      ⌘K
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {["View all", "Monitored", "Unmonitored"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Reference
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                        Purchase
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {transaction.date}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ {transaction.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {transaction.amount}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {transaction.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
