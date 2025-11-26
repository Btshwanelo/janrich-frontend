import React, { memo } from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/base/buttons/button';
import { Avatar } from '@/components/base/avatar/avatar';
import { ProfileHeaderProps } from '@/types/profile';
import { PROFILE_CONSTANTS } from '@/constants/profile';

export const ProfileHeader: React.FC<ProfileHeaderProps> = memo(({
  profileData,
  onShare,
  onViewProfile,
}) => {
  const customerName = profileData?.message?.data?.basic_info?.customer_name || "Loading...";
  const email = profileData?.message?.data?.basic_info?.email || "Loading...";

  return (
    <>
      {/* Blue Header */}
      <div className={`${PROFILE_CONSTANTS.HEADER_HEIGHT.MOBILE} sm:${PROFILE_CONSTANTS.HEADER_HEIGHT.SM} lg:${PROFILE_CONSTANTS.HEADER_HEIGHT.LG} relative mt-16 lg:mt-0`}>
        <div className="absolute inset-0">
          <img
            src="/profile-bg.png"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Profile Section */}
      <div className="mx-auto relative">
        <div className="px-4 sm:px-6 lg:px-8 py-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="relative -mt-8 sm:-mt-12 self-center sm:self-auto">
                <Avatar
                  size="2xl"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Profile"
                  verified={true}
                  contrastBorder={true}
                  className={`shadow-lg border-4 border-white ${PROFILE_CONSTANTS.AVATAR_SIZE.MOBILE} sm:${PROFILE_CONSTANTS.AVATAR_SIZE.DESKTOP}`}
                />
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {customerName}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 self-center sm:self-auto">
              <Button
                color="secondary"
                iconLeading={<Share size={14} data-icon />}
                size="sm"
                className="w-full sm:w-auto"
                onClick={onShare}
              >
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share Profile</span>
              </Button>
              <Button 
                color="primary" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={onViewProfile}
              >
                <span className="hidden sm:inline">View profile</span>
                <span className="sm:hidden">View Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
