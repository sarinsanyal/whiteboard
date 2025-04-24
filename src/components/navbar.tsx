"use client";
import Link from "next/link";
// import { useState } from "react";
import { Home, Plus } from "lucide-react";
import React from "react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
// import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export default function Navbar() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="w-full flex justify-center">
            {/* Sticky Navbar */}
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 
                            inline-flex justify-center border p-5 rounded-full 
                            font-[family-name:var(--font-geist-sans)] 
                            bg-background/50 backdrop-blur-md z-50 
                            max-w-[90%] sm:max-w-fit">
                <div className="flex">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "size-5 mr-3",
                                )}
                            >
                                <Home className="size-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Home</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Create Room */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/room"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "size-5 mr-3",
                                )}
                            >
                                <Plus className="size-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Create Room</p>
                        </TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" color="black" className="mr-2" />

                    {/* Social Links */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="https://github.com/sarinsanyal/whiteboard"
                                target="_blank"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "size-5 mr-5",
                                )}
                            >
                                <FaGithub className="size-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Contribute</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="https://twitter.com/sarinsanyal"
                                target="_blank"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "size-5 mr-5",
                                )}
                            >
                                <FaTwitter className="size-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Twitter</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="https://linkedin.com/in/sarinsanyal"
                                target="_blank"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "size-5 mr-5",
                                )}
                            >
                                <FaLinkedin className="size-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>LinkedIn</p>
                        </TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" color="black" className="mr-2" />

                    {/* Theme Toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                type="button"
                                size={5 as unknown as "default" | "sm" | "lg" | "icon" | null | undefined}
                                className="cursor-pointer"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                <SunIcon className="text-neutral-800 dark:hidden dark:text-neutral-200" />
                                <MoonIcon className="hidden text-neutral-800 dark:block dark:text-neutral-200" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Theme</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
