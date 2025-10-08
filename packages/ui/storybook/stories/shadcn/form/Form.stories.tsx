
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '@ui/shadcn/components/form/Form';
import { Button } from '@ui/shadcn/components/ui/button';
import { Input } from '@ui/shadcn/components/ui/input';
import { Label } from '@ui/shadcn/components/ui/label';

const meta: Meta<typeof Form> = {
  title: 'Gallery/Shadcn/Form/Form',
  component: Form,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" />
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
