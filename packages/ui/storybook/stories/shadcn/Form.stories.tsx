import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '@ui/shadcn/form/Form';

const meta: Meta<typeof Form> = {
  title: 'Form/Form',
  component: Form,
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
