import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { TypingAnimation } from "./magicui/typing-animation";

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "This platform completely changed the way I study with friends. Super smooth and actually fun to use.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "Honestly, I didn’t expect it to be this good. It’s fast, clean, and gets out of your way while you focus.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "It’s like having a virtual study room. I use it every day to prep with my study group. Totally worth it.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "I used to struggle coordinating group study. Now it’s one link and we’re in. Couldn’t be easier.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "Love the minimal UI and how fast everything loads. Makes it easy to just focus and get things done.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "Super helpful for last-minute revision sessions. Shared whiteboard is a game changer.",
        img: "https://avatar.vercel.sh/james",
    },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (

        <figure
            className={cn(
                "bg-gray-50 dark:bg-gray-950 relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export default function Review() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <TypingAnimation className="flex text-3xl font-extrabold sm:text-5xl pb-5">Customer Reviews</TypingAnimation>
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
    );
}
