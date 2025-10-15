import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero_1 } from '@ui/shadcn/hero/hero_1';
import { Button } from '@ui/shadcn/ui/button';

const meta: Meta<typeof Hero_1> = {
  title: 'Hero/Hero_1',
  component: Hero_1,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: 'This is the header',
    subheader: 'This is the subheader',
    ctaButton: <Button>Click me</Button>,
    heroImage: <img src="https://via.placeholder.com/600x400" alt="placeholder" />
  },
};
