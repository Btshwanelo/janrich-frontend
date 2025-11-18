"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Clock,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { User01, HelpCircle as HelpCircleIcon } from "@untitledui/icons";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearAuthCookie, clearCredentials } from "@/lib/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./base/buttons/button";
import { Dropdown } from "./base/dropdown/dropdown";
import { Button as AriaButton } from "react-aria-components";

interface SidebarWrapperProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  onCollapseChange,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, fullName } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    onCollapseChange?.(newState);
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    clearAuthCookie();
    router.push("/login");
  };

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-white border-r border-gray-200 hidden lg:flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen z-10`}
    >
      {/* Logo and Toggle */}
      <div
        className={`mb-6 mt-6 px-4 flex items-center ${
          isSidebarCollapsed
            ? "justify-center flex-col gap-2"
            : "justify-between"
        }`}
      >
        <img
          src="/logo-svg.svg"
          alt="JanRich Logo"
          className={isSidebarCollapsed ? "w-8 h-auto" : "w-10 h-auto"}
        />
        <Button
          color="tertiary"
          size="sm"
          onClick={handleToggle}
          className={isSidebarCollapsed ? "" : "ml-auto"}
        >
          {isSidebarCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-2">
          <a
            href="/dashboard"
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2 text-sm rounded-lg transition-colors ${
              pathname === "/dashboard"
                ? "bg-primary-50 text-primary-600 font-medium"
                : "text-[#535862] hover:bg-gray-100"
            }`}
            title={isSidebarCollapsed ? "Dashboard" : ""}
          >
            <Home className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </a>

          {/* <a
            href="/transactions"
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2 text-sm rounded-lg transition-colors ${
              pathname === "/transactions"
                ? "bg-primary-50 text-primary-600 font-medium"
                : "text-[#535862] hover:bg-gray-100"
            }`}
            title={isSidebarCollapsed ? "Transactions" : ""}
          >
            <Clock className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Transactions</span>}
          </a> */}

          <a
            href="/community"
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center px-2" : "space-x-3 px-3"
            } py-2 text-sm rounded-lg transition-colors ${
              pathname === "/community"
                ? "bg-primary-50 text-primary-600 font-medium"
                : "text-[#535862] hover:bg-gray-100"
            }`}
            title={isSidebarCollapsed ? "Community" : ""}
          >
            <Users className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Community</span>}
          </a>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-2 border-t border-gray-200 bg-white">
        {/* User Profile */}
        <Dropdown.Root>
          <AriaButton
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center " : "space-x-3 px-3"
            } py-2 mt-4 w-full rounded-lg hover:bg-gray-100 transition-colors cursor-pointer outline-none`}
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            {!isSidebarCollapsed && (
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">
                  {fullName ||
                    (typeof user === "string"
                      ? user
                      : (user as any)?.name || (user as any)?.email || "User")}
                </div>
              </div>
            )}
          </AriaButton>

          <Dropdown.Popover className="w-56 bg-white border !border-gray-200 !left-[65px] !right-[50px] !ring-0 [&_*]:outline-none [&_*]:ring-0 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none [&_*:focus-visible]:ring-0">
            <Dropdown.Menu className="!outline-none">
              <Dropdown.Item
                icon={User01}
                onAction={() => router.push("/profile")}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                icon={HelpCircleIcon}
                onAction={() => {
                  // Handle help and support action
                  // You can add a route or modal here
                }}
              >
                Help and Support
              </Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item icon={LogOut} onAction={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.Root>
      </div>
    </div>
  );
};

export default SidebarWrapper;
