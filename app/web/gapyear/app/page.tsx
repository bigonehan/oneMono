

import SmoothScroll  from "@src/components/SmoothScroll";
import { Hero_ttbt } from "@ui/shadcn/components/hero/Hero_ttbt";
import  {HeroContent}  from "@/src/content/HeroContent";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
			 <SmoothScroll />
			<Hero_ttbt
				{...HeroContent}

				/>
        </main>
    );
}
