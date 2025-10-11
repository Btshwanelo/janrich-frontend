'use client'
import React, { useState } from 'react'
import { BarChart3, Clock, HelpCircle, Home, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearAuthCookie, clearCredentials } from '@/lib/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from './base/buttons/button';

const Sidebar = () => {
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
      const { user, fullName } = useAppSelector((state) => state.auth);
      const [isModalOpen, setIsModalOpen] = useState(false);
        const dispatch = useAppDispatch();
        const router = useRouter();
      
      const handleLogout = () => {
        dispatch(clearCredentials());
        clearAuthCookie();
        router.push("/login");
      };
  return (
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
              color="tertiary"
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


          {/* <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          /> */}

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

  )
}

export default Sidebar