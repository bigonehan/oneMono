
import type { Meta, StoryObj } from '@storybook/react';
import { ModalWindow } from '@ui/shadcn/components/dialogue/ModalWindow';
import { Button } from '@ui/shadcn/components/ui/button';
import { useState } from 'react';

const meta: Meta<typeof ModalWindow> = {
  title: 'Gallery/Shadcn/Dialogue/ModalWindow',
  component: ModalWindow,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-bold">Modal Title</h2>
            <p>This is the modal content.</p>
          </div>
        </ModalWindow>
      </>
    );
  },
};
