
import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '@ui/shadcn/components/section/HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Gallery/Shadcn/Section/HeroSection',
  component: HeroSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
