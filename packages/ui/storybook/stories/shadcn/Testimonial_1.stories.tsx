import type { Meta, StoryObj } from '@storybook/react-vite';
import { Testimonial_1 } from '@ui/shadcn/section/Testimonial_1';

const meta: Meta<typeof Testimonial_1> = {
  title: 'Section/Testimonial_1',
  component: Testimonial_1,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const testimonialsExample = [
  {
    content: 'This is a great product!',
    author: 'John Doe',
    role: 'CEO',
    company: 'Example Inc.',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    content: 'I love using this service.',
    author: 'Jane Smith',
    role: 'Designer',
    company: 'Creative Co.',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    content: 'The support team is amazing.',
    author: 'Peter Jones',
    role: 'Developer',
    company: 'Tech Solutions',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

export const Default: Story = {
  args: {
    title: 'Testimonials',
    description: 'What our customers are saying about us.',
    testimonials: testimonialsExample,
  },
};
