
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '@ui/shadcn/components/sidebar/Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Gallery/Shadcn/Sidebar/Sidebar',
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
