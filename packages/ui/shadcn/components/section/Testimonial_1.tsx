import { Card, CardContent } from "@ui/shadcn/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/shadcn/components/ui/avatar";

export interface Testimonialprop {
  content: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export type Testimonial = Testimonialprop;
interface Testimonial_1prop {
  title: string;
  description: string;
  testimonials: Testimonialprop[];
}

export function Testimonial_1({
  title,
  description,
  testimonials = [],
}: Testimonial_1prop) {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                    />
                    <AvatarFallback className="bg-accent/10 text-accent">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
