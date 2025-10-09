'use client';
import React, { useState } from 'react';
import { Home, BarChart3, CreditCard, RefreshCw, Clock, Users, Settings, Share, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/untitled-button';
import { Input } from '@/components/ui/untitled-input';
import { Label } from '@/components/base/input/label';
import { Select } from '@/components/base/select/select';
import { Tabs, } from '@/components/application/tabs/tabs';
import { Badge } from '@/components/base/badges/badges';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/untitled-card';
import { Avatar } from '@/components/base/avatar/avatar';

export default function ProfileBeneficiaryScreen() {
  const [selectedTab, setSelectedTab] = useState('beneficiary');

  const NavIcon = ({ icon: Icon, active = false }: { icon: React.ComponentType<{ className?: string }>, active?: boolean }) => (
    <button className={`p-3 rounded-lg transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
      <Icon className="w-5 h-5" />
    </button>
  );
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
        <div className="p-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded"></div>
          </div>
        </div>

        <NavIcon icon={Home} />
        <NavIcon icon={BarChart3} />
        <NavIcon icon={CreditCard} />
        <NavIcon icon={RefreshCw} />
        <NavIcon icon={Clock} />
        <NavIcon icon={Users} active />

        <div className="flex-1"></div>

        <NavIcon icon={Settings} />
        <Avatar
          size="md"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
          alt="User"
          contrastBorder={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Blue Header */}
        <div className="h-56 relative">
          <div className="absolute  inset-0">
            <img
              src="/image 5.png"
              alt="User"
              className="w-full h-full  object-cover"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className=" mx-auto relative">
          <div className=" px-8 py-4 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative -mt-12">
                  <Avatar
                    size="2xl"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt="Profile"
                    verified={true}
                    contrastBorder={true}
                    className="shadow-lg border-4 border-white w-28 h-28"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Katlego Vilane
                  </h1>
                  <p className="text-gray-600">katv@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="gap-2">
                  <Share className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="primary">View profile</Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full bg-[#FAFAFA]"
            >
              <Tabs.List
                type="button-brand"
                size="md"
                items={[
                  { id: "details", label: "My details" },
                  { id: "beneficiary", label: "Beneficiary Details", badge: 2 },
                  { id: "financial", label: "Financial details" },
                ]}
                className="w-full justify-start"
              >
                {(tab) => <Tabs.Item {...tab} />}
              </Tabs.List>

              <Tabs.Panel className="mt-6">
                <Card variant="default" className="p-8">
                  <div className="grid grid-cols-12 gap-8">
                    {/* Left column - Description */}
                    <div className="col-span-4">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                          Beneficiary Details
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          In the event of your passing (touch wood), where would
                          you like us to direct your funds?
                        </CardDescription>
                      </CardHeader>
                    </div>

                    {/* Right column - Form */}
                    <CardContent className="col-span-8 space-y-6 p-0">
                      <div>
                        <Select
                          label="Beneficiary Type"
                          placeholder="Select an option"
                          items={[
                            { id: "individual", label: "Individual" },
                            { id: "trust", label: "Trust" },
                            { id: "estate", label: "Estate" },
                          ]}
                          className="w-full"
                        >
                          {(item) => (
                            <Select.Item key={item.id} id={item.id}>
                              {item.label}
                            </Select.Item>
                          )}
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            label="Beneficiary name"
                            placeholder="Enter beneficiary name"
                            required
                          />
                        </div>

                        <div>
                          <Input
                            label="Beneficiary Surname"
                            placeholder="Enter beneficiary surname"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex gap-2">
                          <Select
                            defaultSelectedKey="za"
                            items={[{ id: "za", label: "+27" }]}
                            className="w-24"
                          >
                            {(item) => (
                              <Select.Item key={item.id} id={item.id}>
                                <div className="flex items-center gap-2">
                                  <span>🇿🇦</span>
                                  {item.label}
                                </div>
                              </Select.Item>
                            )}
                          </Select>
                          <Input
                            type="tel"
                            placeholder="+27 84 000-0000"
                            className="flex-1"
                            label="Cell Number"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Select
                          label="Relation"
                          placeholder="Select an option"
                          items={[
                            { id: "spouse", label: "Spouse" },
                            { id: "child", label: "Child" },
                            { id: "parent", label: "Parent" },
                            { id: "sibling", label: "Sibling" },
                            { id: "other", label: "Other" },
                          ]}
                          className="w-full"
                          isRequired
                        >
                          {(item) => (
                            <Select.Item key={item.id} id={item.id}>
                              {item.label}
                            </Select.Item>
                          )}
                        </Select>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary">Cancel</Button>
                        <Button variant="primary">Save changes</Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel>
                <Card variant="default" className="p-8">
                  <CardContent>
                    <p className="text-gray-600">
                      My details content goes here...
                    </p>
                  </CardContent>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel>
                <Card variant="default" className="p-8">
                  <CardContent>
                    <p className="text-gray-600">
                      Financial details content goes here...
                    </p>
                  </CardContent>
                </Card>
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}