import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from '@ui/shadcn/sidebar/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Sidebar/Sidebar',
  component: Sidebar,
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
