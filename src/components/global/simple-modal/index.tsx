import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { JSX } from "react"

type SimpleModalProps = {
  trigger: JSX.Element
  children: React.ReactNode
  title?: string
  description?: string
  type?: "Integration"
  logo?: string
}
// note: src of image might need some fixes
export const SimpleModal = ({
  trigger,
  children,
  type,
  title,
  logo,
  description,
}: SimpleModalProps) => {
  switch (type) {
    case "Integration":
      return (
        <Dialog>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent className="bg-themeBlack border-themeDarkGray">
            <div className="flex justify-center gap-3 ">
              <div className="w-12 h-12 relative">
                <Image
                  src={`/corinna.png`}
                  // src={`https://ucarecdn.com/2c9bd4ab-1f00-41df-bad2-df668f65a232/`}
                  height={200}
                  width={200}
                  alt="Corinna"
                />
              </div>
              <div className="text-gray-400">
                <ArrowLeft size={20} />
                <ArrowRight size={20} />
              </div>
              <div className="w-12 h-12 relative">
                <Image
                  src={`/stripe.png`}
                  // src={`https://ucarecdn.com/${logo}/`}
                  // src={`${process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL}/${logo}`}
                  fill
                  sizes="20"
                  alt="Stripe"
                />
              </div>
            </div>
            <DialogHeader className="flex items-center">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription className=" text-center">
                {description}
              </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )
    default:
      return (
        <Dialog>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent className="bg-[#1C1C1E]  !max-w-2xl border-themeGray overflow-visible">
            <DialogTitle>{""}</DialogTitle>
            {children}
          </DialogContent>
        </Dialog>
      )
  }
}
