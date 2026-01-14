"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GROUPLE_CONSTANTS } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UseFormRegister } from "react-hook-form"
import "swiper/css/bundle"
import { SwiperProps, SwiperSlide } from "swiper/react"
import { Slider } from "../slider"
import { GroupListItem } from "./list-item"

type Props = {
  overlay?: boolean
  label?: string
  register?: UseFormRegister<any>
  selected?: string
  route?: boolean
} & SwiperProps

export const GroupListSlider = ({
  overlay,
  label,
  register,
  selected,
  route,
  ...rest
}: Props) => {
  const pathname = usePathname()

  const activeCategoryLabel =
    selected ??
    (route
      ? (() => {
          const segments = pathname.split("/")
          const categorySegment = segments[2] ?? ""

          const activeItem = GROUPLE_CONSTANTS.groupList.find(
            (item) => item.path === categorySegment,
          )

          return activeItem?.label
        })()
      : undefined)

  return (
    <Slider
      slidesPerView={"auto"}
      spaceBetween={10}
      loop
      freeMode
      label={label}
      overlay={overlay}
      {...rest}
    >
      {GROUPLE_CONSTANTS.groupList.map((item, i) => (
        <SwiperSlide key={item.id} className="content-width-slide ">
          {!register ? (
            route ? (
              <Link href={`/explore/${item.path}`}>
                <GroupListItem {...item} selected={activeCategoryLabel} />
              </Link>
            ) : (
              <GroupListItem {...item} selected={activeCategoryLabel} />
            )
          ) : (
            i > 0 && (
              <Label htmlFor={`item-${item.id}`}>
                <span>
                  <Input
                    id={`item-${item.id}`}
                    type="radio"
                    className="hidden"
                    value={item.path}
                    {...register("category")}
                  />
                  <GroupListItem
                    {...item}
                    selected={activeCategoryLabel}
                  />
                </span>
              </Label>
            )
          )}
        </SwiperSlide>
      ))}
    </Slider>
  )
}
