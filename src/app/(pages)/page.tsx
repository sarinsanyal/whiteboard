import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Separator } from "@/components/ui/separator";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Review from "@/components/review";
import Newsletter from "@/components/newsletter";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen max-w-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] mt-20 gap-20">

      {/* Whiteboard Section */}
      <BlurFade delay={0.02} inView>
        <div className="flex flex-col justify-center items-center text-2xl sm:items-start">
          <div className="text-center">Welcome to</div>
          <div className="font-extrabold text-center text-5xl sm:text-8xl">
            <AuroraText>Whiteboard.</AuroraText>
          </div>
          <div className="text-xl font-bold text-gray-500 dark:text-gray-100 mt-10 max-w-xl text-center tracking-tight">
            An online collaborative platform for studying. Create a room, invite your friends, and have a focused study session!
          </div>
        </div>
      </BlurFade>

      {/* new Room Section */}
      <BlurFade delay={0.5} inView>
        <InteractiveHoverButton className="p-5 bg-gray-200 dark:bg-gray-800">
          <Link href="/room">
            Create a New Room!
          </Link>
        </InteractiveHoverButton>
      </BlurFade>


      {/*Features etc.*/}
      <div className="bg-transparent mt-0 z-5 ">
        <BlurFade delay={0.5} inView className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Separator className="mb-15" />
          <TypingAnimation className="flex text-3xl font-extrabold sm:text-5xl pb-5">Why Whiteboard?</TypingAnimation>
          <div className="flex flex-col sm:flex-row">

            <Card className="m-5 w-80 cursor-pointer hover:scale-103 transition-transform ease-in-out duration-400 bg-gray-50 dark:bg-gray-950">
              <CardHeader>
                <CardTitle>🧠 Focused Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Study doesn&apos;t have to be a lonely road. Join or create shared rooms where you and your friends can work side-by-side virtually. Stay accountable, share progress, and support each other — all in a distraction-free environment built for learning.</p>
              </CardContent>
            </Card>

            <Card className="m-5 w-80 cursor-pointer hover:scale-103 transition-transform ease-in-out duration-400 bg-gray-50 dark:bg-gray-950">
              <CardHeader>
                <CardTitle>🎥 Live Whiteboard & Screenshare</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize your ideas effortlessly with our interactive whiteboard and built-in screenshare. Whether you&apos;re solving equations, breaking down concepts, or brainstorming as a team, you can do it all together, live and in sync.</p>
              </CardContent>
            </Card>

            <Card className="m-5 w-80 cursor-pointer hover:scale-103 transition-transform ease-in-out duration-400 bg-gray-50 dark:bg-gray-950">
              <CardHeader>
                <CardTitle>🔗 Easy Room Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Say goodbye to long sign-ups and complicated invites. Create a study room with just a click, and share the link with your group. They&apos;ll be able to join instantly — no installs, no fuss. Just smooth, fast access to your shared workspace.</p>
              </CardContent>
            </Card>

          </div>
          <Separator className="mb-15 mt-10" />
        </BlurFade>
      </div>

      <div>
        <BlurFade delay={0.5} inView>
          <div className="w-screen overflow-clip">
            <Review />
            <Separator className="mb-10 mt-10" />
          </div>
        </BlurFade>
      </div>

      <div>
        <BlurFade delay={0.5} inView>
          <div className="w-screen">
            <Newsletter />
          </div>
        </BlurFade>
      </div>
    </div>
  );
}

