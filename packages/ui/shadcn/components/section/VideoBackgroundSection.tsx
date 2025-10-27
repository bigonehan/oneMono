import type { ReactNode, VideoHTMLAttributes } from "react";
import { cn } from "@ui/shadcn/utils";

interface VideoBackgroundSectionProps {
  /** Video file or stream URL used as the section background. */
  src: string;
  /** Poster frame displayed before the video becomes ready. */
  poster?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  videoClassName?: string;
  /** Additional props applied to the underlying <video> element. */
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster">;
}

/**
 * Full-bleed section that plays a looping background video while keeping the content readable
 * with a primary-colour gradient overlay.
 */
export const VideoBackgroundSection = ({
  src,
  poster,
  children,
  className,
  contentClassName,
  overlayClassName,
  videoClassName,
  videoProps,
}: VideoBackgroundSectionProps) => {
  const {
    autoPlay = true,
    muted = true,
    loop = true,
    playsInline = true,
    ...restVideoProps
  } = videoProps ?? {};

  return (
    <section
      data-anim="pane"
      className={cn(
        "relative isolate flex min-h-[32rem] w-full items-center justify-center overflow-hidden py-24 px-4 sm:px-6 lg:px-8",
        "bg-background text-foreground transition-colors",
        className,
      )}
    >
      <video
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          "motion-safe:scale-100",
          videoClassName,
        )}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        {...restVideoProps}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/80 via-background/60 to-transparent",
          "transition-opacity",
          overlayClassName,
        )}
      />
      <div
        data-anim="content"
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 text-balance",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};
