import { GlassModal } from "@/components/global/glass-modal"
import { JoinGroupPaymentForm } from "@/components/global/join-group"
import { StripeElements } from "@/components/global/stripe/elements"
import { Button } from "@/components/ui/button"
import {
  useActiveGroupSubscription,
  useGetGroupMembers,
  useJoinFree,
} from "@/hooks/payment"

type JoinButtonProps = {
  owner: boolean
  groupid: string
  userid: string
}

export const JoinButton = ({ owner, groupid, userid }: JoinButtonProps) => {
  const { data } = useActiveGroupSubscription(groupid)
  const { onJoinFreeGroup } = useJoinFree(groupid)
  const { data: groupMembers } = useGetGroupMembers(groupid)
  // console.log("groupmembers",groupMembers?.members)
  const isMember = groupMembers?.members?.some(
    (member) => member?.User?.id === userid,
  )

  if (!owner) {
    // if (data?.status === 200) {
    //   return (
    //     <GlassModal
    //       trigger={
    //         <Button className="w-full p-10" variant="ghost">
    //           <p>Join ${data.subscription?.price}/Month</p>
    //         </Button>
    //       }
    //       title="Join this group"
    //       description="Pay now to join this community"
    //     >
    //       <StripeElements>
    //         <JoinGroupPaymentForm groupid={groupid} />
    //       </StripeElements>
    //     </GlassModal>
    //   )
    // }

    if (isMember) {
      return (
        <Button className="w-full p-10" variant="ghost" disabled>
          You are already enrolled
        </Button>
      )
    }

    return (
      <Button onClick={onJoinFreeGroup} className="w-full p-10" variant="ghost">
        Join now
      </Button>
    )
  }

  return (
    <Button disabled={owner} className="w-full p-10" variant="ghost">
      Owner
    </Button>
  )
}
