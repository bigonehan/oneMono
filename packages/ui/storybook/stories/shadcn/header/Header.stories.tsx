
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@ui/shadcn/components/header/Header';

const meta: Meta<typeof Header> = {
  title: 'Gallery/Shadcn/Header/Header',
  component: Header,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
