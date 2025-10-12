import Image from "next/image";	
import HeroHeader from "@ui/shadcn/hero/hero_1";
import { heroHeaderConfig } from "@/config/heroHeaderConfig";
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div> this is simple page 
      <HeroHeader config={heroHeaderConfig} /> {/* props로 config 전달 */}
			</div>
		</main>
	);
}
