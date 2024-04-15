"use client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type TrackerProps = {
  data: { color: string; tooltip: string }[];
  className?: string;
};

/**
 * @param {data} data.color - Its a utility class from TailwindCSS like bg-blue-400
 **/

export function Tracker({ data, className }: TrackerProps) {
  return (
    <div className={cn(["h-10 flex items-center space-x-0.5", className])}>
      <TooltipProvider>
        {data.map((val, index) => (
          <Tooltip key={"tracker-" + index}>
            <TooltipTrigger asChild>
              <div
                className={cn([
                  "w-full h-full rounded-[1px] first:rounded-l-[4px] last:rounded-r-[4px]",
                  val.color,
                ])}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{val.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
