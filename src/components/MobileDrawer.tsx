'use client'
import React from 'react'
import { BarChart3, Clock, HelpCircle, Home, LogOut, Settings, Users, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { clearAuthCookie, clearCredentials } from '@/lib/slices/authSlice'
import { useRouter } from 'next/navigation'
import { Button } from './base/buttons/button'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, fullName } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(clearCredentials())
    clearAuthCookie()
    router.push("/login")
  }

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <img
            src="/logo-svg.svg"
            alt="JanRich Logo"
            className="w-10 h-auto"
          />
          <Button
            color="tertiary"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {fullName ||
                (typeof user === "string"
                  ? user
                  : (user as any)?.name || (user as any)?.email || "User")}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            {/* <a
              href="#"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </a> */}
            <a
              href="/profile"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Community</span>
            </a>
            {/* <a
              href="#"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span>History</span>
            </a> */}
            <a
              href="/profile"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Profile</span>
            </a>
            <a
              href="#"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </a>
            <a
              href="#"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <button
              onClick={() => {
                handleLogout()
                handleLinkClick()
              }}
              className="flex items-center space-x-3 px-4 py-4 text-[#535862] text-sm hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}

export default MobileDrawer
