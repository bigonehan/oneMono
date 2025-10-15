import type { Meta, StoryObj } from '@storybook/react-vite';
import { HelloUI } from '@ui/shadcn/menu/HelloUI';

const meta: Meta<typeof HelloUI> = {
  title: 'Menu/HelloUI',
  component: HelloUI,
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
