"use client"

import { cn } from "@/lib/utils"
import { JSX } from "react"

type GroupListItemProps = {
  icon: JSX.Element
  label: string
  path: string
  selected?: string
}

export const GroupListItem = ({
  icon,
  label,
  path,
  selected,
}: GroupListItemProps) => {
  const isSelected = selected === label || selected === path

  return (
    <div
      className={cn(
        "flex gap-3 items-center py-2 px-4 rounded-2xl border-2 cursor-pointer transition-colors",
        isSelected
          ? "border-white bg-white/10 text-white"
          : "border-themeGray bg-themeGray text-themeTextGray",
      )}
    >
      {icon}
      <span className={cn(isSelected && "font-semibold")}>{label}</span>
    </div>
  )
}
