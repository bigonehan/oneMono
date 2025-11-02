import { Lightbulb } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/shadcn/components/ui/tabs";
import { SectionWrapper } from "../SectionWrapper";

export interface Featureprop {
    id: string;
    icon: React.ReactNode;
    heading: string;
    description: string;
    image: string;
    url: string;
    isDefault: boolean;
}

const FeaturesExample: Featureprop[] = [
    {
        id: "feature-1",
        heading: "Research",
        icon: <Lightbulb className="size-4" />,

        description:
            "Discover the powerful features that make our platform stand out from the rest.",
        image:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
        url: "https://shadcnblocks.com",
        isDefault: true,
    }
]
export const Feature_2 = ({
    id,
    features = FeaturesExample,
}: { id?: string; features?: Featureprop[] }) => {
    const defaultTab =
        features.find((tab) => tab.isDefault)?.id || features[0].id;

    return (
        <SectionWrapper id={id} className="py-32">
            <Tabs defaultValue={defaultTab} className="p-0">
                <TabsList className="bg-background flex h-auto w-full flex-col gap-2 p-0 md:flex-row">
                    {features.map((tab) => {
                        return (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={`hover:border-muted data-[state=active]:bg-muted group flex w-full flex-col items-start justify-start gap-1 whitespace-normal rounded-md border p-4 text-left shadow-none transition-opacity duration-200 hover:opacity-80 data-[state=active]:shadow-none ${tab.isDefault ? "" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                                    {tab.icon && (
                                        <span
                                            className="bg-muted text-muted-foreground group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground flex size-8 items-center justify-center rounded-full transition-opacity duration-200 lg:size-10"
                                        >
                                            {tab.icon}
                                        </span>
                                    )}
                                    <p
                                        data-section-heading
                                        className="text-lg font-semibold transition-opacity duration-200 md:text-2xl lg:text-xl"
                                    >
                                        {tab.heading}
                                    </p>
                                </div>
                                <p
                                    data-section-body
                                    className="text-muted-foreground font-normal transition-opacity duration-200 md:block"
                                >
                                    {tab.description}
                                </p>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {features.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        value={tab.id}
                        className="transition-opacity duration-300"
                    >
                        <img
                            src={tab.image}
                            alt={tab.heading}
                            className="aspect-video w-full rounded-md object-cover transition-opacity duration-300"
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </SectionWrapper>
    );
};
