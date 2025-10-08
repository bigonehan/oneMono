
import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '@ui/shadcn/components/footer/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Gallery/Shadcn/Footer/Footer',
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
