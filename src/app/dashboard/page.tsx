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
  PiggyBank,
  FileText,
  ChartPie,
  SearchCheck,
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
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Download01, File01 } from "@untitledui/icons";
import { CircularProgress } from "@/components/CircularProgress";
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
import MobileTopNav from "@/components/MobileTopNav";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("View all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUserDismissedModal, setHasUserDismissedModal] = useState(false);
  const [savingsProgress, setSavingsProgress] = useState(40); // Dynamic percentage
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(true);

  const router = useRouter();
  const { user, fullName, customer } = useAppSelector((state) => state.auth);
  const { data, refetch } = useGetProfileQuery(customer || "");

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

  // Function to update savings progress (you can connect this to real data)
  const updateSavingsProgress = (newProgress: number) => {
    setSavingsProgress(Math.min(100, Math.max(0, newProgress)));
  };

  interface Transaction {
    id: string;
    date: string;
    status: string;
    amount: string;
    type: string;
  }

  // For testing empty state, you can temporarily set this to an empty array: []
  const transactions: Transaction[] = [
    {
      id: "JR0001",
      date: "Jan 6, 2025",
      status: "Paid",
      amount: "R 0.90",
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
    {
      id: "JR0004",
      date: "Jan 3, 2025",
      status: "Paid",
      amount: "R 1200.00",
      type: "Savings Deposit",
    },
    {
      id: "JR0005",
      date: "Jan 2, 2025",
      status: "Pending",
      amount: "R 500.00",
      type: "Investment",
    },
    {
      id: "JR0006",
      date: "Jan 1, 2025",
      status: "Paid",
      amount: "R 750.25",
      type: "Savings Deposit",
    },
    {
      id: "JR0007",
      date: "Dec 31, 2024",
      status: "Paid",
      amount: "R 3000.00",
      type: "Investment",
    },
    {
      id: "JR0008",
      date: "Dec 30, 2024",
      status: "Paid",
      amount: "R 150.75",
      type: "Savings Deposit",
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "purchase", label: "Purchase" },
  ];

  const chartData = [
    { month: "Jan", orange: 0, blue: 0, gray: 10000 },
    { month: "Feb", orange: 0, blue: 0, gray: 0 },
    { month: "Mar", orange: 0, blue: 0, gray: 0 },
    { month: "Apr", orange: 0, blue: 0, gray: 0 },
    { month: "May", orange: 0, blue: 0, gray: 0 },
    { month: "Jun", orange: 0, blue: 0, gray: 0 },
    { month: "Jul", orange: 0, blue: 0, gray: 0 },
    { month: "Aug", orange: 0, blue: 0, gray: 0 },
    { month: "Sep", orange: 0, blue: 0, gray: 0 },
    { month: "Oct", orange: 0, blue: 0, gray: 0 },
    { month: "Nov", orange: 0, blue: 0, gray: 0 },
    { month: "Dec", orange: 0, blue: 0, gray: 0 },
  ];
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
        {/* Mobile Top Navigation */}
        <MobileTopNav />

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
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-5 mt-16 lg:mt-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h1 className="text-base lg:text-2xl font-semibold text-gray-900">
                Welcome back,{" "}
                {fullName ||
                  (typeof user === "string"
                    ? user.split(" ")[0]
                    : (user as any)?.name?.split(" ")[0] || "Olivia")}
              </h1>
              <div className="flex items-center gap-2 lg:gap-3">
                <Button
                  color="link-gray"
                  size="md"
                  className="gap-2"
                  iconLeading={<Search data-icon />}
                ></Button>
                <Button
                  color="secondary"
                  size="md"
                  className="gap-2 hidden sm:flex"
                  iconLeading={<ChartPie className="w-4 h-4 " />}
                >
                  <span className="hidden sm:inline">
                    View Group Savings Dashboard
                  </span>
                  <span className="sm:hidden">Group Dashboard</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-4 lg:p-8 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Savings Breakdown Chart */}
              <Card className="lg:col-span-2 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        Savings breakdown
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Keep track of your savings and interest earned.
                      </p>
                    </div>
                    <Button color="tertiary" size="sm">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Chart Area */}
                  <div className="overflow-x-auto">
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 mb-6 px-2 sm:px-4 min-w-[600px]">
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1 min-w-[40px]"
                        >
                          <div
                            className="w-full flex flex-col items-center relative"
                            style={{ height: "200px" }}
                          >
                            <div className="w-full flex flex-col justify-end items-center h-full gap-0.5">
                              <div
                                className="w-8 sm:w-12 bg-gray-200 rounded-t"
                                style={{
                                  height: `${(item.gray / 10000) * 200}px`,
                                }}
                              ></div>
                              <div
                                className="w-8 sm:w-12 bg-blue-600 rounded-t"
                                style={{
                                  height: `${(item.blue / 10000) * 200}px`,
                                }}
                              ></div>
                              <div
                                className="w-8 sm:w-12 bg-orange-500"
                                style={{
                                  height: `${(item.orange / 10000) * 200}px`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 mt-3 font-medium">
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 justify-center align-middle items-center flex mb-4 px-4">
                    Month
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                      color="secondary"
                      size="md"
                      className="gap-2"
                      iconLeading={<FileText className="w-4 h-4" />}
                    >
                      <span>Get statement</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lets Get Going Card */}
              <Card className="border-2 border-blue-600 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Lets get going
                    </CardTitle>
                    <Button color="tertiary" size="sm">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Dynamic Circular Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <CircularProgress
                      percentage={savingsProgress}
                      size={400}
                      strokeWidth={16}
                      className="h-64 w-full"
                      color={
                        savingsProgress >= 100
                          ? "green"
                          : savingsProgress >= 75
                          ? "blue"
                          : savingsProgress >= 50
                          ? "yellow"
                          : "red"
                      }
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-3xl font-semibold text-[#535862] mb-1">
                          Savings goal
                        </div>
                        <div className="text-3xl font-semibold text-[#181D27]">
                          {savingsProgress}%
                        </div>
                      </div>
                    </CircularProgress>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {savingsProgress >= 100
                        ? "Congratulations! You've reached your goal!"
                        : "The best way to win is to keep going."}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {savingsProgress >= 100
                        ? "You've successfully achieved your savings target. Consider setting a new goal to continue your financial journey."
                        : `You're ${savingsProgress}% of the way there, you're more likely to meet your savings goal by December if you don't stop now.`}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Demo controls - remove these in production */}
                    {/* <div className="flex gap-2">
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={() =>
                          updateSavingsProgress(savingsProgress - 10)
                        }
                        disabled={savingsProgress <= 0}
                      >
                        -10%
                      </Button>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={() =>
                          updateSavingsProgress(savingsProgress + 10)
                        }
                        disabled={savingsProgress >= 100}
                      >
                        +10%
                      </Button>
                    </div> */}

                    <Button
                      color="secondary"
                      size="md"
                      className="justify-center"
                      // iconLeading={<Zap data-icon />}
                    >
                      <span>Beat the first deposit slump</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <TableCard.Root className="max-w-[calc(100vw-2rem)] sm:max-w-full">
              <TableCard.Header
                title="Transactions"
                badge={`${transactions.length} Transaction${
                  transactions.length !== 1 ? "s" : ""
                }`}
                description="Keep track of your transactions."
                contentTrailing={
                  currentTransactions.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Input
                          icon={Search}
                          placeholder="Search"
                          className="w-80"
                          shortcut="⌘K"
                        />
                      </div>
                      <Button
                        color="secondary"
                        size="md"
                        iconTrailing={<Filter className="w-4 h-4" />}
                      >
                        <span>Filters</span>
                      </Button>
                    </div>
                  )
                }
              />

              <Table
                aria-label="Transactions"
                selectionMode="multiple"
                sortDescriptor={undefined}
                onSortChange={() => {}}
              >
                <Table.Header>
                  <Table.Head
                    id="reference"
                    label="Reference"
                    isRowHeader
                    className=""
                  />
                  <Table.Head id="date" label="Date" />
                  <Table.Head id="status" label="Status" />
                  <Table.Head id="amount" label="Amount" />
                  <Table.Head id="purchase" label="Purchase" className="" />
                </Table.Header>

                <Table.Body items={currentTransactions}>
                  {(item) => (
                    <Table.Row id={item.id}>
                      <Table.Cell>
                        <span className="font-medium text-sm text-gray-900">
                          {item.id}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-gray-600">
                          {item.date}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === "Paid"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          <span className="text-base leading-none">
                            {item.status === "Paid" ? "✓" : "⏳"}
                          </span>
                          {item.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-sm text-gray-900">
                          {item.amount}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="">
                        <span className="text-sm text-gray-600">
                          {item.type}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>

              {/* Pagination */}
              {transactions.length > itemsPerPage && (
                <PaginationPageMinimalCenter
                  page={currentPage}
                  total={totalPages}
                  onPageChange={handlePageChange}
                  className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
                />
              )}

              {transactions.length == 0 && (
                <EmptyState size="md" className="py-16">
                  <EmptyState.Header pattern="none">
                    <div
                      className="flex items-center 
                    "
                    >
                      <img
                        src="Illustration.svg"
                        alt="No Transactions"
                        className="w-[152px] h-[118px]"
                      />
                    </div>
                  </EmptyState.Header>
                  <EmptyState.Content>
                    <EmptyState.Title>
                      First step to a million is R100
                    </EmptyState.Title>
                    <EmptyState.Description>
                      Take the first step and make a deposit.
                    </EmptyState.Description>
                  </EmptyState.Content>
                  <EmptyState.Footer>
                    <Button
                      color="primary"
                      size="md"
                      iconLeading={<PiggyBank />}
                    >
                      Pay yourself first
                    </Button>
                  </EmptyState.Footer>
                </EmptyState>
              )}
            </TableCard.Root>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
