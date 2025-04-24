"use client"

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen max-w-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <DotPattern
        width={20}
        height={20}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] sm:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />
      <BlurFade delay={0.02} inView>
        <main className="flex justify-center flex-col text-2xl row-start-2 sm:items-start">
          <div className="text-center">
            Welcome to
          </div>
          <div className="font-extrabold text-center text-5xl sm:text-8xl">
            <AuroraText>Whiteboard.</AuroraText>
          </div>
          <div className="text-lg text-gray-500 mt-10 max-w-xl text-center tracking-tight">
            An online collaborative platform for studying. Create a room, invite your friends, and have a focused study session!
          </div>
        </main>
      </BlurFade>
    </div>
  );
}
