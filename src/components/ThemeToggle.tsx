"use client";

import { useTheme } from "next-themes";
import { Moon01, Sun } from "@untitledui/icons";
import { useEffect, useState } from "react";
import { Button } from "./base/buttons/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                color="tertiary"
                size="sm"
                aria-label="Toggle theme"
            >
                <Sun className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Button
            color="tertiary"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
        >
            {theme === "light" ? <Moon01 className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
    );
}
