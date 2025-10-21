"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  PiggyBank,
  FileText,
  ChartPie,
  Check,
} from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/untitled-card";
import { Table, TableCard } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { CircularProgress } from "@/components/CircularProgress";
import AuthGuard from "@/components/AuthGuard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useGetProfileQuery, useGetLedgerQuery } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import SidebarWrapper from "@/components/SidebarWrapper";
import MobileTopNav from "@/components/MobileTopNav";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { strict } from "assert";

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
  const { data: dataLedger } = useGetLedgerQuery(customer || "");

  const savingsGoal = data?.message?.data?.financials?.annual_savings_goal || 0;
  const transactions: Transaction[] = dataLedger?.message?.data || [];
  useEffect(() => {
    // Check if savings goal hasn't been set (0, null, undefined, or missing)
    const savingsGoal = data?.message?.data?.financials?.annual_savings_goal;
    if (savingsGoal === 0 && !hasUserDismissedModal) {
      setIsModalOpen(true);
    } else if (savingsGoal && savingsGoal > 0) {
      setIsModalOpen(false);
      setHasUserDismissedModal(false); // Reset dismissal flag when goal is set
    }
  }, [data, hasUserDismissedModal]);

  // Function to update savings progress (you can connect this to real data)
  const updateSavingsProgress = (newProgress: number) => {
    setSavingsProgress(Math.min(100, Math.max(0, newProgress)));
  };

  interface Transaction {
    amount: number;
    currency: string;
    customer_id: string;
    customer_name: string;
    gateway: string;
    payment_date: string;
    payment_type: string;
    status: string;
    transaction_ref: string;
  }

  // For testing empty state, you can temporarily set this to an empty array: []

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function calculateSavingsProgress(totalSavingGoal, payments) {
    // Initialize chart data for all 12 months
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = monthNames.map((month) => ({
      month,
      orange: 0,
      blue: 0,
      gray: 0,
    }));

    // Filter only "Clear" status payments and group by month
    const clearPayments = payments.filter(
      (payment) => payment.status === "Clear"
    );

    // Calculate savings per month (not cumulative)
    const monthlySavings = {};

    clearPayments.forEach((payment) => {
      const date = new Date(payment.payment_date);
      const monthIndex = date.getMonth(); // 0-11

      if (!monthlySavings[monthIndex]) {
        monthlySavings[monthIndex] = 0;
      }
      monthlySavings[monthIndex] += payment.amount;
    });

    // Build chart data with monthly totals only
    for (let i = 0; i < 12; i++) {
      if (monthlySavings[i]) {
        chartData[i].blue = monthlySavings[i];
      }
    }

    // Calculate total saved across all months
    const totalSaved = clearPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Calculate percentage
    const saving_goal_percentage = Math.min(
      Math.round((totalSaved / totalSavingGoal) * 100),
      100
    );

    return {
      chartData,
      saving_goal_percentage,
    };
  }

  const result = calculateSavingsProgress(savingsGoal, transactions);

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
          customerId={customer}
          onSave={async (amount) => {
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
                    : (user as any)?.name?.split(" ")[0])}
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
                      {result.chartData.map((item, index) => (
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
                      percentage={result.saving_goal_percentage}
                      size={400}
                      strokeWidth={16}
                      className="h-64 w-full"
                      color={
                        result.saving_goal_percentage >= 100
                          ? "green"
                          : result.saving_goal_percentage >= 75
                          ? "blue"
                          : result.saving_goal_percentage >= 50
                          ? "yellow"
                          : "red"
                      }
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-3xl font-semibold text-[#535862] mb-1">
                          Savings goal
                        </div>
                        <div className="text-3xl font-semibold text-[#181D27]">
                          {result.saving_goal_percentage}%
                        </div>
                      </div>
                    </CircularProgress>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {result.saving_goal_percentage >= 100
                        ? "Congratulations! You've reached your goal!"
                        : "The best way to win is to keep going."}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {result.saving_goal_percentage >= 100
                        ? "You've successfully achieved your savings target. Consider setting a new goal to continue your financial journey."
                        : `You're ${result.saving_goal_percentage}% of the way there, you're more likely to meet your savings goal by December if you don't stop now.`}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <Button
                      color="secondary"
                      size="md"
                      className="justify-center ml-auto"
                      // iconLeading={<Zap data-icon />}
                    >
                      <span>Beat the first deposit slump</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <TableCard.Root className="max-w-[calc(100vw-2rem)] bg-white sm:max-w-full">
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
                          className=""
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
                <Table.Header className="bg-gray-50">
                  <Table.Head id="reference" label="Reference" isRowHeader />
                  <Table.Head id="date" label="Date" />
                  <Table.Head id="status" label="Status" />
                  <Table.Head id="amount" label="Amount" />
                  <Table.Head id="gateway" label="Gateway" className="" />
                </Table.Header>

                <Table.Body items={currentTransactions}>
                  {(item) => (
                    <Table.Row id={item.transaction_ref}>
                      <Table.Cell>
                        <span className="font-medium text-sm text-[#181D27]">
                          {item.transaction_ref}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-[#535862]">
                          {item.payment_date}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <BadgeWithIcon
                          type="pill-color"
                          color="success"
                          size="md"
                          iconLeading={Check}
                        >
                          {item.status}
                        </BadgeWithIcon>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-sm text-[#535862]">
                          {item.amount}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="">
                        <span className="text-sm text-[#535862]">
                          {item.gateway}
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
