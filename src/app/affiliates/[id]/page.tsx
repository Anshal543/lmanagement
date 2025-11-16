import { onVerifyAffilateLink } from "@/actions/groups"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
  }>
}

const AffiliatesPage = async ({ params }: Props) => {
  const { id } = await params
  const status = await onVerifyAffilateLink(id)

  if (status.status === 200) {
    return redirect(`/group/create?affiliate=${id}`)
  }

  if (status.status !== 200) {
    return redirect("/")
  }
}

export default AffiliatesPage
