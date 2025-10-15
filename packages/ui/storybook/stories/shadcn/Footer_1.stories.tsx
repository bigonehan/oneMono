import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer_1 } from '@ui/shadcn/components/footer/Footer_1';

const meta: Meta<typeof Footer_1> = {
  title: 'Footer/Footer_1',
  component: Footer_1,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
