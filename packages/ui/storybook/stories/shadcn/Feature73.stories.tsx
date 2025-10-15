import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature73 } from '@ui/shadcn/section/Feature_1';

const meta: Meta<typeof Feature73> = {
  title: 'Section/Feature73',
  component: Feature73,
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
