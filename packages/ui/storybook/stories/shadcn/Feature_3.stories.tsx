import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature_3 } from '@ui/shadcn/section/Feature_3';

const meta: Meta<typeof Feature_3> = {
  title: 'Section/Feature_3',
  component: Feature_3,
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
