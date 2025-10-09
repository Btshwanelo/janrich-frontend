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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/untitled-button";
import { Input } from "@/components/ui/untitled-input";
import { Checkbox } from "@/components/ui/untitled-checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/untitled-card";
import { Table, TableCard } from "@/components/application/table/table";
import ProfileModal from "@/components/ProfileModal";
import AuthGuard from "@/components/AuthGuard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearCredentials, clearAuthCookie, useGetProfileQuery } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import SavingsGoalModal from "@/components/SavingsGoalModal";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("View all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(true);

  const {data} = useGetProfileQuery("JR0001");
console.log("Profile Data:", data);
  const router = useRouter();
  const { user, fullName } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    clearAuthCookie();
    router.push("/login");
  };

  interface Transaction {
    id: string;
    date: string;
    status: string;
    amount: string;
    type: string;
  }

  const transactions: Transaction[] = [
    {
      id: "JR0001",
      date: "Jan 6, 2025",
      status: "Paid",
      amount: "R 3500.90",
      type: "Savings Deposit",
    },
    {
      id: "JR0002",
      date: "Jan 5, 2025",
      status: "Pending",
      amount: "R 2500.00",
      type: "Investment",
    },
    {
      id: "JR0003",
      date: "Jan 4, 2025",
      status: "Paid",
      amount: "R 1800.50",
      type: "Savings Deposit",
    },
  ];

  const columns = [
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "purchase", label: "Purchase" },
  ];

  return (
    <PublicRouteGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <div
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen z-10`}
        >
          {/* Logo and Toggle */}
          <div className="mb-6 mt-6 px-4 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <img
                src="/logo-svg.svg"
                alt="JanRich Logo"
                className="w-12 h-auto"
              />
            )}
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="ml-auto"
            >
              {isSidebarCollapsed ? (
                <Menu className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </Button>
          </div>

          <SavingsGoalModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSave={(amount) => console.log("Saved amount:", amount)}
          />

          <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Navigation */}
          <nav className="flex-1 px-4 overflow-y-auto">
            <div className="space-y-2">
              <a
                href="#"
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                } py-2 text-gray-900 bg-gray-100 rounded-lg`}
                title={isSidebarCollapsed ? "Dashboard" : ""}
              >
                <Home className="w-5 h-5" />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </a>
              <a
                href="#"
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                } py-2 text-gray-600 hover:bg-gray-100 rounded-lg`}
                title={isSidebarCollapsed ? "Analytics" : ""}
              >
                <BarChart3 className="w-5 h-5" />
                {!isSidebarCollapsed && <span>Analytics</span>}
              </a>
              <a
                href="#"
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                } py-2 text-gray-600 hover:bg-gray-100 rounded-lg`}
                title={isSidebarCollapsed ? "Community" : ""}
              >
                <Users className="w-5 h-5" />
                {!isSidebarCollapsed && <span>Community</span>}
              </a>
              <a
                href="#"
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
                } py-2 text-gray-600 hover:bg-gray-100 rounded-lg`}
                title={isSidebarCollapsed ? "History" : ""}
              >
                <Clock className="w-5 h-5" />
                {!isSidebarCollapsed && <span>History</span>}
              </a>
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 space-y-2 border-t border-gray-200 bg-white">
            <a
              href="#"
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 text-gray-600 hover:bg-gray-100 rounded-lg`}
              title={isSidebarCollapsed ? "Support" : ""}
            >
              <HelpCircle className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Support</span>}
            </a>
            <a
              href="#"
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 text-gray-600 hover:bg-gray-100 rounded-lg`}
              title={isSidebarCollapsed ? "Settings" : ""}
            >
              <Settings className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </a>
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left`}
              title={isSidebarCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>

            {/* User Profile */}
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
              } py-2 mt-4`}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              {!isSidebarCollapsed && (
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {fullName || (typeof user === 'string' ? user : user?.name || user?.email || "User")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {fullName || (typeof user === 'string' ? user : user?.name || user?.email || "User")}
              </h1>
              <div className="flex items-center space-x-4">
                <Input
                  leftIcon={<Search className="w-4 h-4" />}
                  placeholder="Search"
                  className="w-64"
                />
                <Button
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <span>Customize</span>
                </Button>
                <Button
                  variant="secondary"
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
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        Savings breakdown
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Keep track of your savings and interest earned.
                      </p>
                    </div>
                    <Button variant="tertiary" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                    <Button variant="secondary" size="sm">
                      View full report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Keep it up Card */}
              <Card className="border-primary-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Keep it up
                    </CardTitle>
                    <Button variant="tertiary" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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

                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Upgrade plan</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <TableCard.Root className="">
              <TableCard.Header
                title="Transactions"
                badge="240 Transaction"
                description="Keep track of your transactions."
                // contentTrailing={
                //   <div className="flex items-center space-x-4">
                //     <Input
                //       leftIcon={<Search className="w-4 h-4" />}
                //       placeholder="Search"
                //       className="w-64"
                //       rightIcon={
                //         <span className="text-xs text-gray-400">⌘K</span>
                //       }
                //     />
                //     <Button
                //       variant="secondary"
                //       size="sm"
                //       className="flex items-center space-x-2"
                //     >
                //       <Filter className="w-4 h-4" />
                //       <span>Filters</span>
                //     </Button>
                //   </div>
                // }
              />

              {/* Tabs */}
              <div className="flex space-x-1 p-4 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-end space-x-4">
                  <Input
                    leftIcon={<Search className="w-4 h-4" />}
                    placeholder="Search"
                    className="w-64"
                    rightIcon={
                      <span className="text-xs text-gray-400">⌘K</span>
                    }
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              <Table
                selectionMode="multiple"
                selectionBehavior="toggle"
                size="md"
              >
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Head
                      id={column.key}
                      isRowHeader={column.key === "reference"}
                      label={column.label}
                    />
                  )}
                </Table.Header>
                <Table.Body>
                  {transactions.map((item) => (
                    <Table.Row key={item.id} columns={columns}>
                      <Table.Cell>
                        <span className="font-medium text-gray-900">
                          {item.id}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-gray-600">{item.date}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status === "Paid" ? "✓" : "⏳"} {item.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-gray-900">
                          {item.amount}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-gray-600">{item.type}</span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </TableCard.Root>
          </main>
        </div>
      </div>
    </PublicRouteGuard>
  );
};

export default Dashboard;
