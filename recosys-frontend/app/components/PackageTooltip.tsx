"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface PackageTooltipProps {
  data: any;
}

export default function PackageTooltip({ data }: PackageTooltipProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
            Package Details
          </button>
        </Tooltip.Trigger>

        <Tooltip.Content
          side="top"
          align="center"
          className="z-50 max-h-[250px] max-w-[300px] overflow-auto rounded-md border bg-white p-3 text-xs text-slate-800 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
          <Tooltip.Arrow className="fill-white dark:fill-slate-900" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}