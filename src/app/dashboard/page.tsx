"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/untitled-card";
import { Table, TableCard } from "@/components/application/table/table";
import ProfileModal from "@/components/ProfileModal";
import AuthGuard from "@/components/AuthGuard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  clearCredentials,
  clearAuthCookie,
  useGetProfileQuery,
} from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import PublicRouteGuard from "@/components/PublicRouteGuard";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import SidebarWrapper from "@/components/SidebarWrapper";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("View all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUserDismissedModal, setHasUserDismissedModal] = useState(false);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(true);

  const router = useRouter();
  const { user, fullName, customer } = useAppSelector((state) => state.auth);
  const { data, refetch } = useGetProfileQuery(customer);

  useEffect(() => {
    // Check if savings goal hasn't been set (0, null, undefined, or missing)
    const savingsGoal = data?.message?.data?.financials?.annual_savings_goal;
    if (savingsGoal === 0 && !hasUserDismissedModal) {
      console.log(
        "Savings goal not set, opening modal. Current value:",
        savingsGoal
      );
      setIsModalOpen(true);
    } else if (savingsGoal && savingsGoal > 0) {
      console.log("Savings goal already set:", savingsGoal);
      setIsModalOpen(false);
      setHasUserDismissedModal(false); // Reset dismissal flag when goal is set
    }
  }, [data, hasUserDismissedModal]);

  console.log("profile data", data);
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
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
        <SavingsGoalModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setHasUserDismissedModal(true);
          }}
          customerId={customer || "JR0001"}
          onSave={async (amount) => {
            console.log("Savings goal saved:", amount);
            // Refetch profile data to get updated savings goal
            await refetch();
            setIsModalOpen(false);
          }}
        />

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
                Welcome back,{" "}
                {fullName ||
                  (typeof user === "string"
                    ? user
                    : (user as any)?.name || (user as any)?.email || "User")}
              </h1>
              <div className="flex items-center space-x-4">
                <Input icon={Search} placeholder="Search" className="w-64" />
                <Button
                  color="secondary"
                  className="flex items-center space-x-2"
                >
                  <span>Customize</span>
                </Button>
                <Button
                  color="secondary"
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
                    <Button color="tertiary" size="sm">
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
                    <Button color="secondary" size="sm">
                      View full report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Keep it up Card */}
              <Card className="border-2 border-[#155EEF]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Keep it up
                    </CardTitle>
                    <Button color="tertiary" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Circular Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-full h-32">
                      <img
                        src="/Progress circle.svg"
                        alt="Savings Goal Chart"
                        className="w-full max-h-60"
                      />
                      {/* <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            40%
                          </div>
                          <div className="text-xs text-gray-600">
                            Savings goal
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">
                      10%
                    </span>
                  </div>

                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      You've almost reached your goal
                    </h3>
                    <p className="text-sm text-gray-600">
                      Save R 12 500 by November 2025 to meet your savings goal.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      color="secondary"
                      className=""
                      onClick={() => {
                        setIsModalOpen(true);
                        setHasUserDismissedModal(false);
                      }}
                      iconLeading={<Zap data-icon />}
                    >
                      <span>Set Savings Goal</span>
                    </Button>
                  </div>
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
                //       color="secondary"
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
                    icon={Search}
                    placeholder="Search"
                    className="w-64"
                    shortcut="⌘K"
                  />
                  <Button
                    color="secondary"
                    size="md"
                    className="flex items-center space-x-2"
                    iconTrailing={<Filter className="w-4 h-4" />}
                  >
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              <Table
                selectionMode="multiple"
                selectionBehavior="toggle"
                size="sm"
                className={"border border-gray-50"}
              >
                <Table.Header
                  columns={columns}
                  className={"bg-gray-50 border border-gray-50"}
                >
                  {(column) => (
                    <Table.Head
                      id={column.key}
                      isRowHeader={column.key === "reference"}
                      label={column.label}
                      className={"bg-gray-50"}
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
    </AuthGuard>
  );
};

export default Dashboard;
