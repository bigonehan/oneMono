import Image from "next/image";	
import HeroHeader from "@ui/shadcn/hero/hero_1";
import { HeroConfig } from "@ui/shadcn/types/hero"

export const heroHeaderConfig: HeroConfig = {
  header: `Landing pages made easy`,
  subheader: `Easy to setup. Customizable. Quick. Responsive.`,
  image: `/hero-img.webp`,
  ctaLink: "https://github.com/redpangilinan/next-shadcn-landing", 
  ctaText: "Get started",
}


export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div> this is simple page 
      <HeroHeader config={heroHeaderConfig} /> {/* props로 config 전달 */}
			</div>
		</main>
	);
}
