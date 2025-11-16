"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GROUPLE_CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { cn, useDynamicPaths } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MenuProps = {
  orientation: "mobile" | "desktop"
}

const Menu = ({ orientation }: MenuProps) => {
  const { section, onSetSection } = useNavigation()
  const { getDynamicPath } = useDynamicPaths()
  const pathname = usePathname()
  switch (orientation) {
    case "desktop":
      return (
        <Card
          className="bg-themeGray border-themeGray bg-clip-padding backdrop--blur__safari 
        backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex  md:rounded-xl flex items-center justify-center w-fit"
        >
          <CardContent className="p-0 flex gap-2">
            {GROUPLE_CONSTANTS.groupPageMenu.map((menuItem) => {
              const dynamicPath = getDynamicPath(menuItem.label)
              const isActive = pathname == dynamicPath
              return (
                <Link
                  href={dynamicPath}
                  onClick={() => onSetSection(dynamicPath)}
                  className={cn(
                    "rounded-xl flex gap-2 py-2 px-4 items-center",
                    isActive ? "bg-[#09090B] border-[#27272A]" : "",
                  )}
                  key={menuItem.id}
                >
                  {isActive && menuItem.icon}
                  {menuItem.label}
                </Link>
              )
            })}
          </CardContent>
        </Card>
      )

    case "mobile":
      return (
        <div className="flex flex-col mt-10">
          {GROUPLE_CONSTANTS.groupPageMenu.map((menuItem) => {
            const dynamicPath = getDynamicPath(menuItem.label)
            const isActive = pathname == dynamicPath
            return (
              <Link
                href={menuItem.path}
                onClick={() => onSetSection(dynamicPath)}
                className={cn(
                  "rounded-xl flex gap-2 py-2 px-4 items-center",
                  isActive ? "bg-themeGray border-[#27272A]" : "",
                )}
                key={menuItem.id}
              >
                {menuItem.icon}
                {menuItem.label}
              </Link>
            )
          })}
        </div>
      )
    default:
      return <></>
  }
}

export default Menu
