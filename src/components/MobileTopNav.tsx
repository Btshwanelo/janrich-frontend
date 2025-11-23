'use client'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './base/buttons/button'
import MobileDrawer from './MobileDrawer'

const MobileTopNav = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
            src="/jr-logo-black.svg"
            alt="JanRich Logo"
            className="w-10 h-auto"
          />

          {/* Menu Button */}
          <Button color="tertiary" size="sm" onClick={toggleDrawer}>
            {isDrawerOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

export default MobileTopNav
