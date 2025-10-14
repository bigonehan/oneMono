import Image from "next/image";	
import HeroHeader from "@ui/shadcn/hero/hero_1";
import {Hero_2} from "@ui/shadcn/hero/hero_2";
import { heroHeaderConfig } from "@/config/heroHeaderConfig";
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div> 

				<Hero_2/>
			</div>
		</main>
	);
}
