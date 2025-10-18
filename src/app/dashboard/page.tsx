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

  interface Transaction {
    id: string;
    date: string;
    status: string;
    amount: string;
    type: string;
  }

  // For testing empty state, you can temporarily set this to an empty array: []
  const transactions: Transaction[] = [
    // {
    //   id: "JR0001",
    //   date: "Jan 6, 2025",
    //   status: "Paid",
    //   amount: "R 3500.90",
    //   type: "Savings Deposit",
    // },
    // {
    //   id: "JR0002",
    //   date: "Jan 5, 2025",
    //   status: "Pending",
    //   amount: "R 2500.00",
    //   type: "Investment",
    // },
    // {
    //   id: "JR0003",
    //   date: "Jan 4, 2025",
    //   status: "Paid",
    //   amount: "R 1800.50",
    //   type: "Savings Deposit",
    // },
  ];

  const columns = [
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "purchase", label: "Purchase" },
  ];

  const chartData = [
    { month: "Jan", orange: 3000, blue: 3000, gray: 4000 },
    { month: "Feb", orange: 3500, blue: 3500, gray: 3000 },
    { month: "Mar", orange: 2500, blue: 2500, gray: 3500 },
    { month: "Apr", orange: 3000, blue: 3000, gray: 2000 },
    { month: "May", orange: 2800, blue: 2000, gray: 3000 },
    { month: "Jun", orange: 3500, blue: 3000, gray: 2500 },
    { month: "Jul", orange: 2700, blue: 2800, gray: 2800 },
    { month: "Aug", orange: 3200, blue: 3300, gray: 3200 },
    { month: "Sep", orange: 2900, blue: 2400, gray: 2600 },
    { month: "Oct", orange: 2600, blue: 2200, gray: 2400 },
    { month: "Nov", orange: 2400, blue: 2000, gray: 2200 },
    { month: "Dec", orange: 2500, blue: 2300, gray: 2500 },
  ];
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
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
          <header className="bg-white border-b border-gray-200 px-8 py-5">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-gray-900">
                Welcome back,{" "}
                {fullName ||
                  (typeof user === "string"
                    ? user.split(" ")[0]
                    : (user as any)?.name?.split(" ")[0] || "Olivia")}
              </h1>
              <div className="flex items-center gap-3">
                <Button
                  color="secondary"
                  size="md"
                  className="gap-2"
                  iconLeading={<Settings data-icon />}
                >
                  <span>Customize</span>
                </Button>
                <Button
                  color="secondary"
                  size="md"
                  className="gap-2"
                  iconLeading={<Download01 className="w-4 h-4" />}
                >
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 p-8 bg-gray-50">
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
                  <div className="h-64 flex items-end justify-between gap-4 mb-6 px-4">
                    {chartData.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="w-full flex flex-col items-center relative"
                          style={{ height: "200px" }}
                        >
                          <div className="w-full flex flex-col justify-end items-center h-full gap-0.5">
                            <div
                              className="w-12 bg-gray-200 rounded-t"
                              style={{
                                height: `${(item.gray / 10000) * 200}px`,
                              }}
                            ></div>
                            <div
                              className="w-12 bg-blue-600 rounded-t"
                              style={{
                                height: `${(item.blue / 10000) * 200}px`,
                              }}
                            ></div>
                            <div
                              className="w-12 bg-orange-500"
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

                  <div className="text-sm text-gray-500 mb-4 px-4">Month</div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                      color="secondary"
                      size="md"
                      className="gap-2"
                      iconLeading={<File01 className="w-4 h-4" />}
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
                  {/* Circular Progress */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relativeh-48 flex items-center justify-center">
                      {/* Background circle */}
                      <img
                        src={"/goal.svg"}
                        alt="Circle Background"
                        className="h-48"
                      />
                      {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-sm text-gray-600 mb-1">
                          Savings goal
                        </div>
                        <div className="text-4xl font-semibold text-gray-900">
                          40%
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      The best way to win is to keep going.
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You're 40% of the way there, you're more likely to meet
                      your savings goal by December if you don't stop now.
                    </p>
                  </div>

                  <div className="justify-end flex">
                    <Button
                      color="secondary"
                      size="md"
                      className="justify-center"
                      iconLeading={<Zap data-icon />}
                    >
                      <span>Beat the first deposit slump</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions */}
            <TableCard.Root className="shadow-sm bg-white">
              <TableCard.Header
                title="Transactions"
                // badge="240 Transaction"
                description="Keep track of your transactions."
              />

              {/* Search and Filter Bar */}
              {transactions.length > 0 && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-b border-gray-200">
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
              )}

              <Table
                selectionMode="multiple"
                selectionBehavior="toggle"
                size="sm"
                className="border-0"
              >
                {transactions.length > 0 && (
                  <Table.Header columns={columns} className="bg-gray-50">
                    {(column) => (
                      <Table.Head
                        id={column.key}
                        isRowHeader={column.key === "reference"}
                        label={column.label}
                        className="bg-gray-50 text-xs font-medium text-gray-600"
                      />
                    )}
                  </Table.Header>
                )}
                <Table.Body>
                  {transactions.length > 0 &&
                    transactions.map((item) => (
                      <Table.Row key={item.id} columns={columns}>
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
                        <Table.Cell>
                          <span className="text-sm text-gray-600">
                            {item.type}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
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
