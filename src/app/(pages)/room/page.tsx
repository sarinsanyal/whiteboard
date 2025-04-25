"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Card } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/magicui/aurora-text";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function Room() {
    const [nickname, setNickname] = useState("");
    const [valuesEntered, setValuesEntered] = useState(false);
    const [ID, setID] = useState("");
    const [IdEntered, setIdEntered] = useState(false);

    const handleJoinRoom = () => {
        if (!nickname.trim()) {
            alert("Please enter a nickname.");
            return;
        }

        const sessionId = uuidv4();
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("roomId", ID);

        const sessionData = {
            nickname: nickname,
            sessionId: sessionId,
            roomId: ID
        };
        console.log("User Joined Room Details:", sessionData);
    };

    const handleNew = () => {
        if (!nickname.trim()) {
            alert("Please enter a nickname.");
            return;
        }
        const sessionId = uuidv4();
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("sessionId", sessionId);

        const sessionData = {
            nickname: nickname,
            sessionId: sessionId
        };
        console.log("User Created New Room Details:", sessionData);
    }
    return (
        <div className="flex flex-col items-center min-h-screen max-w-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-20 gap-10">
            <BlurFade className="flex text-3xl font-extrabold sm:text-5xl pb-5 z-1" delay={0.02} inView>
                <AuroraText>
                    Create/Join a Room
                </AuroraText>
            </BlurFade>

            <BlurFade delay={0.5} inView>
                <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-4xl">
                    <div className="w-full sm:w-2/3 sm:mr-10 lg:mr-40 px-4 sm:px-0">
                        <Card className="flex flex-col justify-center bg-gray-50 dark:bg-gray-950 w-full h-fit">
                            <div className="grid w-full max-w-sm items-center gap-1.5 m-5 overflow-ellipsis">
                                <Label htmlFor="nickname">Enter Nickname</Label>
                                <Input
                                    className="mt-2"
                                    type="nickname"
                                    id="nickname"
                                    placeholder="Nickname"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value);
                                        setValuesEntered(true);
                                        if (!e.target.value) setValuesEntered(false);
                                    }}
                                />
                                <div className="w-full my-4 border-b border-black"></div>
                                <Button
                                    onClick={handleNew}
                                    disabled={!valuesEntered}
                                    className="bg-blue-700 cursor-pointer">
                                    Create New Room
                                </Button>
                                <div className="relative flex items-center mt-4">
                                    <div className="w-full border-b border-gray-300"></div>
                                    <span className="px-3 text-sm text-gray-500">OR</span>
                                    <div className="w-full border-b border-gray-300"></div>
                                </div>
                                <Label className="mb-2" htmlFor="nickname">Enter Room ID</Label>
                                <InputOTP
                                    maxLength={7}
                                    value={ID}
                                    onChange={(ID) => {
                                        setID(ID);
                                        setIdEntered(true);
                                        if (!ID) setIdEntered(false);
                                    }}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                        <InputOTPSlot index={6} />
                                    </InputOTPGroup>
                                </InputOTP>

                                <Button
                                    disabled={!valuesEntered || !IdEntered}
                                    onClick={handleJoinRoom}
                                    className="mt-4 cursor-pointer dark:bg-white dark:text-black"
                                >
                                    Join Room
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="w-1/3 mt-20 sm:mt-0">
                        <Carousel
                            opts={{
                                loop: true,
                            }}
                        >
                            <CarouselContent className="">
                                <CarouselItem className="flex rounded-2xl flex-col items-center">
                                    <Image src="/carousel/1.png" alt={"img"} width={1000} height={1000}></Image>
                                    <BlurFade delay={0.1} inView>
                                        <h3 className="font-semibold text-xl">Anonymous Login</h3>
                                        <p>Enjoy hassle-free study with no need to Login/SignUp. Choose a name and join a room!</p>
                                    </BlurFade>
                                </CarouselItem>
                                <CarouselItem className="flex rounded-2xl flex-col items-center">
                                    <Image src="/carousel/2.png" alt={"img"} width={1000} height={1000}></Image>
                                    <BlurFade delay={0.1} inView>
                                        <h3 className="font-semibold text-xl">Fast Chats</h3>
                                        <p>Have no delay in sending text messages or doubts to your study partners!</p>
                                    </BlurFade>
                                </CarouselItem>
                                <CarouselItem className="flex rounded-2xl flex-col items-center">
                                    <Image src="/carousel/3.png" alt={"img"} width={1000} height={1000}></Image>
                                    <BlurFade delay={0.1} inView>
                                        <h3 className="font-semibold text-xl">Real-time Collaboration</h3>
                                        <p>Engage in a video-call, share your screen or even use a whiteboard to understand ideas!</p>
                                    </BlurFade>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious className="cursor-pointer" />
                            <CarouselNext className="cursor-pointer" />
                        </Carousel>
                    </div>
                </div>
            </BlurFade>
        </div>
    )
}