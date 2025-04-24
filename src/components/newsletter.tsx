"use client"

import { TypingAnimation } from "./magicui/typing-animation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import {useState} from "react";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState('');

    const emailSubmit = async () => {
        if (!email) {
            toast.error("Please enter valid Email!");
            return;
        }
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.message("Thank you for subscribing!");
                setEmail(""); 
            } else {
                toast.message("Failed to subscribe. Please try again.");
            }
        } catch (err) {
            console.log("Error with newsletter!", err);
            toast.error("Error Occured while subscribing");
        }
    };

    return (
        <div className="flex flex-col items-center font-[family-name:var(--font-geist-sans)] mb-20">
            <TypingAnimation className="flex p-0 text-3xl font-extrabold sm:text-5xl pb-5">Join our Newsletter!</TypingAnimation>
            <Card className="w-100">
                <CardHeader>
                    <CardTitle>
                        Enter your email for newsletter and for being the first one to receive updates!
                    </CardTitle>
                    <CardContent className="px-0">
                        <div className="flex flex-row m-5 ml-0">
                            <Input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <Button onClick={emailSubmit} type="submit" className="ml-1 cursor-pointer"> Submit</Button>
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}