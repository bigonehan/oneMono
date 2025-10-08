
import type { Meta, StoryObj } from '@storybook/react';
import { HelloUI } from '@ui/shadcn/components/menu/HelloUI';

const meta: Meta<typeof HelloUI> = {
  title: 'Gallery/Shadcn/Menu/HelloUI',
  component: HelloUI,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
