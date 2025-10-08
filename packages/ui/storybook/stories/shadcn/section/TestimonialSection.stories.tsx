
import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialSection } from '@ui/shadcn/components/section/TestimonialSection';

const meta: Meta<typeof TestimonialSection> = {
  title: 'Gallery/Shadcn/Section/TestimonialSection',
  component: TestimonialSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
