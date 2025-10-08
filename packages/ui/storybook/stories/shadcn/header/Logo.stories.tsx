
import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from '@ui/shadcn/components/header/Logo';

const meta: Meta<typeof Logo> = {
  title: 'Gallery/Shadcn/Header/Logo',
  component: Logo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
