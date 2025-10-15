import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature_2 } from '@ui/shadcn/section/Feature_2';

const meta: Meta<typeof Feature_2> = {
  title: 'Section/Feature_2',
  component: Feature_2,
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
