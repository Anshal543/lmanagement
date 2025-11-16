import { IGroupInfo } from "@/components/global/sidebar"
import { createClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface IChannels {
  status: number
  channels: {
    id: string
    name: string
    icon: string
    createdAt: Date
    groupId: string | null
  }[]
}

interface IAboutGroupInfo {
  status: number
  groupOwner: boolean
  group: {
    id: string
    active: boolean
  }
}

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const truncateString = (string: string) => {
  return string.slice(0, 60) + "..."
}

export const validateURLString = (url: string) => {
  const youtubeRegex = new RegExp("www.youtube.com")
  const loomRegex = new RegExp("www.loom.com")
  if (youtubeRegex.test(url)) {
    return {
      url,
      type: "YOUTUBE",
    }
  }

  if (loomRegex.test(url)) {
    return {
      url,
      type: "LOOM",
    }
  } else {
    return {
      url: undefined,
      type: "IMAGE",
    }
  }
}
export const useDynamicPaths = () => {
  const { data: groupInfo } = useQuery({
    queryKey: ["group-info"],
  }) as { data: IGroupInfo }

  const { data: channels } = useQuery({
    queryKey: ["group-channels"],
  }) as { data: IChannels }
  const { data: aboutGroupInfo } = useQuery({
    queryKey: ["about-group-info"],
  }) as { data: IAboutGroupInfo }

  const getDynamicPath = (label: string) => {
    switch (label) {
      case "Group":
        if (groupInfo && channels) {
          return `/group/${groupInfo?.group?.id}/channel/${channels.channels[0].id}`
        }

      case "About":
        if (aboutGroupInfo) {
          return `/about/${aboutGroupInfo.group.id}`
        }
      case "Courses":
        if (groupInfo && groupInfo?.group?.id) {
          return `/group/${groupInfo?.group?.id}/courses`
        }
      default:
        return ""
    }
  }
  return { getDynamicPath }
}

export function getPath(pathname: string, memberid: string) {
  const path = pathname.split("/").pop()
  if (path == "messages") {
    return `${pathname}/${memberid}`
  }
  return `${pathname.split("/").slice(0, -1).join("/")}/${memberid}`
}
