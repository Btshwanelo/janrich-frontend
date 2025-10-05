"use client";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/ui/untitled-input";
import { useTheme } from "next-themes";
import { Moon01, Sun, Mail01, Lock01, User01, SearchMd } from "@untitledui/icons";
import { useEffect, useState } from "react";

export default function TestUntitledPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Untitled UI Integration Test
                </h1>
                
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Button Components
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            <Button color="primary">Primary Button</Button>
                            <Button color="secondary">Secondary Button</Button>
                            <Button color="tertiary">Tertiary Button</Button>
                            <Button color="primary-destructive">Destructive Button</Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Button Sizes
                        </h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Theme Toggle
                        </h2>
                        <Button
                            color="tertiary"
                            size="sm"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            {mounted && theme === "light" ? <Moon01 className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            Toggle Theme
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Input Fields
                        </h2>
                        <div className="space-y-4">
                            <Input 
                                label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                                leftIcon={<Mail01 className="w-4 h-4" />}
                            />
                            
                            <Input 
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                                leftIcon={<Lock01 className="w-4 h-4" />}
                            />
                            
                            <Input 
                                label="Full Name"
                                placeholder="Enter your full name"
                                leftIcon={<User01 className="w-4 h-4" />}
                            />
                            
                            <Input 
                                label="Search"
                                placeholder="Search for something..."
                                leftIcon={<SearchMd className="w-4 h-4" />}
                                rightIcon={<SearchMd className="w-4 h-4" />}
                            />
                            
                            <Input 
                                label="Error State"
                                placeholder="This field has an error"
                                variant="error"
                                error="This field is required"
                            />
                            
                            <Input 
                                label="Success State"
                                placeholder="This field is valid"
                                variant="success"
                                helperText="Great! This looks good."
                            />
                            
                            <div className="grid grid-cols-3 gap-4">
                                <Input 
                                    label="Small"
                                    placeholder="Small input"
                                    size="sm"
                                />
                                <Input 
                                    label="Medium"
                                    placeholder="Medium input"
                                    size="md"
                                />
                                <Input 
                                    label="Large"
                                    placeholder="Large input"
                                    size="lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Color Palette Test
                        </h2>
                        <div className="grid grid-cols-5 gap-4">
                            <div className="bg-primary-500 h-16 rounded flex items-center justify-center text-white text-sm font-medium">
                                Primary
                            </div>
                            <div className="bg-gray-500 h-16 rounded flex items-center justify-center text-white text-sm font-medium">
                                Gray
                            </div>
                            <div className="bg-error-500 h-16 rounded flex items-center justify-center text-white text-sm font-medium">
                                Error
                            </div>
                            <div className="bg-warning-500 h-16 rounded flex items-center justify-center text-white text-sm font-medium">
                                Warning
                            </div>
                            <div className="bg-success-500 h-16 rounded flex items-center justify-center text-white text-sm font-medium">
                                Success
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
