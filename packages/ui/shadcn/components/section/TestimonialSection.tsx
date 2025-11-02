import * as React from "react"
import {
  Card,
  CardContent,
} from "@ui/shadcn/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui/shadcn/components/ui/avatar"
import { SectionWrapper } from "../SectionWrapper"

const testimonialsContent = [
  {
    quote: "This product is amazing! It has changed my life.",
    name: "Jane Doe",
    title: "CEO, Example Inc.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    quote: "I can't imagine working without it. Highly recommended.",
    name: "John Smith",
    title: "Developer, Awesome Co.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    quote: "The best investment I've made this year. A real game-changer.",
    name: "Peter Jones",
    title: "Designer, Creative Minds",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
]

/**
 * A section that displays a grid of testimonials with quotes, names, titles, and avatars.
 * @returns {JSX.Element} - The rendered testimonial section component.
 */
const TestimonialSection = ({ id }: { id?: string }) => {
  return (
    <SectionWrapper
      id={id}
      className="bg-muted"
      contentClassName="space-y-12"
    >
      <div className="text-center space-y-2">
        <h2 data-section-heading className="text-3xl font-bold">
          What Our Customers Say
        </h2>
        <p data-section-body className="text-muted-foreground">
          Real stories from real people.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonialsContent.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <p data-section-body className="italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center mt-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p data-section-heading className="font-bold">
                    {testimonial.name}
                  </p>
                  <p
                    data-section-body
                    className="text-sm text-muted-foreground"
                  >
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}

export { TestimonialSection }
