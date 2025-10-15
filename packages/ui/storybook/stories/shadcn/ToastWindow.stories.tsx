import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastWindow } from '@ui/shadcn/dialogue/ToastWindow';

const meta: Meta<typeof ToastWindow> = {
  title: 'Dialogue/ToastWindow',
  component: ToastWindow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
