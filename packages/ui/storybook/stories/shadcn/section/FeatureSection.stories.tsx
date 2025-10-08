
import type { Meta, StoryObj } from '@storybook/react';
import { FeatureSection } from '@ui/shadcn/components/section/FeatureSection';

const meta: Meta<typeof FeatureSection> = {
  title: 'Gallery/Shadcn/Section/FeatureSection',
  component: FeatureSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
