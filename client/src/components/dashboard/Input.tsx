import { Locate, LocateFixed } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function Input(props: {
    placeholder: string;
    className?: string;
    icon: "pickup" | "dropoff";
}) {
    const { placeholder, className, icon } = props;
    return (
        <div
            className={twMerge(
                "bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4",
                className,
            )}
        >
            {icon === "pickup" ? (
                <Locate className="text-lime-500" />
            ) : (
                <LocateFixed className="text-lime-500" />
            )}
            <input
                type="text"
                placeholder={placeholder}
                className="bg-transparent w-full outline-none text-black"
            />
        </div>
    );
}
