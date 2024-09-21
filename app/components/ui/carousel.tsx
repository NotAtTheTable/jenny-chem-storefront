"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { CircleChevronLeft, CircleChevronRight } from "lucide-react"

import LeftArrowBlue from "~/assets/foundational/arrows/carousel_blue_arrow_left.svg"
import LeftArrowWhite from "~/assets/foundational/arrows/carousel_white_arrow_left.svg"
import RightArrowBlue from "~/assets/foundational/arrows/carousel_blue_arrow_right.svg"
import RightArrowWhite from "~/assets/foundational/arrows/carousel_white_arrow_right.svg"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import "./carousel.css"
import { useImperativeHandle, useRef } from "react"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  snapPoints: number[]
  selectedSnapPoint: number
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [snapPoints, setSnapPoints] = React.useState<number[]>([]);
    const [selectedSnapPoint, setSelectedSnapPoint] = React.useState<number>(0);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setSnapPoints(api.scrollSnapList())
      setSelectedSnapPoint(api.selectedScrollSnap())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const scrollTo = React.useCallback((index: number) => {
      api?.scrollTo(index)
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          scrollTo,
          selectedSnapPoint,
          snapPoints,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export type CarouselContentRef = { scrollTo: (index: number) => void; } | null

const CarouselContent = React.forwardRef<
  CarouselContentRef,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation, scrollTo } = useCarousel()
  const divRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    scrollTo: (index) => {
      scrollTo(index);
    },
  }));

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={divRef}
        className={cn(
          "flex",
          orientation === "horizontal" ? "" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pl-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { white?: boolean, iconClassName?: string, currentLastIndex: number, setLastIndex: (index: number) => void, skip: number }
>(({ className, variant = "outline", size = "icon", white = false, iconClassName, currentLastIndex, setLastIndex, skip, ...props }, ref) => {
  const { orientation, scrollPrev, scrollTo, canScrollPrev } = useCarousel()

  const handleClick = () => {
    scrollTo(currentLastIndex - skip);
    setLastIndex(currentLastIndex - skip);
  }

  return (
    <button
      ref={ref}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
        { 'opacity-30': !canScrollPrev }
      )}
      disabled={!canScrollPrev}
      onClick={handleClick}
      {...props}
    >
      <img className={iconClassName} src={white ? LeftArrowWhite : LeftArrowBlue} />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { white?: boolean, iconClassName?: string, currentLastIndex: number, setLastIndex: (index: number) => void, skip: number }
>(({ className, variant = "outline", white = false, iconClassName, size = "icon", currentLastIndex, setLastIndex, skip, ...props }, ref) => {
  const { orientation, scrollNext, scrollTo, canScrollNext } = useCarousel()

  const handleClick = () => {
    scrollTo(currentLastIndex + skip);
    setLastIndex(currentLastIndex + skip);
  }

  return (
    <button
      ref={ref}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
        { 'opacity-30': !canScrollNext } // Add opacity if button is disabled
      )}
      disabled={!canScrollNext}
      onClick={handleClick}
      {...props}
    >
      <img className={iconClassName} src={white ? RightArrowWhite : RightArrowBlue} />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselBreadcrumbs = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className }, ref) => {
  const { snapPoints, selectedSnapPoint, scrollTo } = useCarousel();

  const handleClick = (index: number) => {
    scrollTo(index);
  }
  return (
    <div className="breadcrumbs">
      {
        snapPoints.map((point: number, index: number) => (
          < button
            key={index}
            ref={ref}
            className={cn(
              'breadcrumb',
              `${index == selectedSnapPoint ? 'breadcrumb--selected' : ''}`,
              className)}
            onClick={() => handleClick(index)}
          >
          </button >
        ))
      }
    </div>
  )
})
CarouselBreadcrumbs.displayName = "CarouselBreadcrumbs"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselBreadcrumbs
}
