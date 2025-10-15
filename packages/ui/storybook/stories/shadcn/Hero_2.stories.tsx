import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero_2 } from '@ui/shadcn/hero/hero_2';

const meta: Meta<typeof Hero_2> = {
  title: 'Hero/Hero_2',
  component: Hero_2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: 'New',
    heading: 'This is the heading',
    description: 'This is the description',
    buttons: {
      primary: {
        text: 'Primary Button',
        url: '#',
      },
      secondary: {
        text: 'Secondary Button',
        url: '#',
      },
    },
    image: {
      src: 'https://via.placeholder.com/600x400',
      alt: 'placeholder',
    },
  },
};
