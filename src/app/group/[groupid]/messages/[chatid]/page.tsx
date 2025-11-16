import { onAuthenticatedUser } from "@/actions/auth"
import { onGetAllUserMessages, onGetUserFromMembership } from "@/actions/groups"
import { HuddlesForm } from "@/components/forms/huddle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { User } from "lucide-react"
import { ChatWindow } from "../_components/chat"

const MemberChatPage = async ({
  params,
}: {
  params: Promise<{ chatid: string }>
}) => {
  const { chatid } = await params
  const query = new QueryClient()
  const member = await onGetUserFromMembership(chatid)

  await query.prefetchQuery({
    queryKey: ["user-messages", member?.member?.User?.id!],
    queryFn: () => onGetAllUserMessages(member?.member?.User?.id!),
  })

  const user = await onAuthenticatedUser()
  // console.log("🟣 chatid", chatid)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="h-full flex flex-col p-5">
        <div className="bg-themeBlack rounded-2xl p-5">
          <div className="flex gap-x-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={member?.member?.User?.image!} alt="User" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-2xl capitalize">
              {member?.member?.User?.firstname} {member?.member?.User?.lastname}
            </h3>
          </div>
        </div>
        <ChatWindow userid={user.id!} recieverid={member?.member?.User?.id!} />
        <HuddlesForm recieverid={member?.member?.User?.id!} />
      </div>
    </HydrationBoundary>
  )
}

export default MemberChatPage
