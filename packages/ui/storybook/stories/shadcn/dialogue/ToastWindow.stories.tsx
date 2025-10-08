
import type { Meta, StoryObj } from '@storybook/react';
import { ToastWindow } from '@ui/shadcn/components/dialogue/ToastWindow';
import { Button } from '@ui/shadcn/components/ui/button';
import { useToast } from '@ui/shadcn/components/ui/use-toast';
import { Toaster } from '@ui/shadcn/components/ui/toaster';

const meta: Meta<typeof ToastWindow> = {
  title: 'Gallery/Shadcn/Dialogue/ToastWindow',
  component: ToastWindow,
};

export default meta;

type Story = StoryObj<typeof meta>;

const ToastWrapper = () => {
    const { toast } = useToast()

    return (
        <Button
        onClick={() => {
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
        }}
      >
        Show Toast
      </Button>
    )
}

export const Default: Story = {
  render: () => (
    <>
     <Toaster />
      <ToastWrapper />
    </>
  ),
};
