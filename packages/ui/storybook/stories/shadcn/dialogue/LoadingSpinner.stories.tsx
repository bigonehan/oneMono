
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '@ui/shadcn/components/dialogue/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Gallery/Shadcn/Dialogue/LoadingSpinner',
  component: LoadingSpinner,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
