import type { Meta, StoryObj } from '@storybook/react-vite';
import { TestimonialSection } from '@ui/shadcn/section/TestimonialSection';

const meta: Meta<typeof TestimonialSection> = {
  title: 'Section/TestimonialSection',
  component: TestimonialSection,
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
