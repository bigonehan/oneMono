import * as React from "react"
import {
  Card,
  CardContent,
} from "@ui/shadcn/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui/shadcn/ui/avatar"

const testimonials = [
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
const TestimonialSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <p className="text-muted-foreground mt-2">
          Real stories from real people.
        </p>
      </div>
      <div className="container mx-auto mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <p className="italic">"{testimonial.quote}"</p>
              <div className="flex items-center mt-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { TestimonialSection }
