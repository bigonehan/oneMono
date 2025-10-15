import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from '@ui/shadcn/dialogue/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Dialogue/LoadingSpinner',
  component: LoadingSpinner,
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
