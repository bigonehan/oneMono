import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroSection } from '@ui/shadcn/section/HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Section/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
