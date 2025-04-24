"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, Sun, Moon, Plus, Mail,  } from "lucide-react";
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

export default function Navbar() {
    const [theme, setTheme] = useState(false);

    return (
        <div
            className="sticky top-5 left-1/2 transform -translate-x-1/2 
                       w-fit flex justify-center border p-5 rounded-full 
                       font-[family-name:var(--font-geist-sans)] bg-background/50 backdrop-blur-md z-1"
        >
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
                            href="/"
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

                <Separator orientation="vertical" color="black" className="mr-2"/>

                {/*Contact Details */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="https://github.com/sarinsanyal/whiteboard"
                            target="_blank"
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "size-5 mr-3",
                            )}
                        >
                            <FaGithub className="size-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Contribute</p>
                    </TooltipContent>
                </Tooltip>

            </div>
        </div>
    );
}
