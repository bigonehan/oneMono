


import type { ReactNode, VideoHTMLAttributes } from "react";
import { cn } from "@ui/shadcn/utils";

interface VideoBackgroundSectionProps {
  id?: string;
  src: string;
  poster?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  videoClassName?: string;
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster">;
}

export const VideoBackgroundSection = ({
  id,
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
      id={id}
      className={cn(
        "relative isolate flex min-h-[32rem] w-full items-center justify-center overflow-hidden py-24 px-4 sm:px-6 lg:px-8",
        "bg-background text-foreground transition-colors",
        className,
      )}
    >
      {/* 🎥 비디오 */}
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

      {/* 🌓 위아래 그라데이션 오버레이 */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",

"bg-gradient-to-b from-black/30 via-black/10 via-20% via-transparent via-80% to-black/30",
          "transition-opacity duration-700",
          overlayClassName,
        )}
      />

      {/* ✨ 콘텐츠 */}
      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 text-balance text-center text-white",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};
