import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModalWindow } from '@ui/shadcn/dialogue/ModalWindow';
import { Button } from '@ui/shadcn/ui/button';

const meta: Meta<typeof ModalWindow> = {
  title: 'Dialogue/ModalWindow',
  component: ModalWindow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button>Open Modal</Button>,
    title: 'Modal Title',
    description: 'This is a description for the modal.',
    children: <div>Modal Content</div>,
    footer: <Button>Close</Button>,
  },
};
