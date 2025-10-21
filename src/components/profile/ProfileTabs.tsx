import React, { memo } from 'react';
import { Tabs } from '@/components/application/tabs/tabs';
import { PROFILE_TABS } from '@/constants/profile';

interface ProfileTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = memo(({
  selectedTab,
  onTabChange,
  children,
}) => {
  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={(key) => onTabChange(key as string)}
      className="w-full bg-[#FAFAFA] overflow-x-auto"
    >
      <Tabs.List
        type="button-gray"
        size="sm"
        items={PROFILE_TABS}
      />
      {children}
    </Tabs>
  );
});
