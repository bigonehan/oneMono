
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ui/shadcn/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@ui/shadcn/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@ui/shadcn/components/ui/avatar';
import { Badge } from '@ui/shadcn/components/ui/badge';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@ui/shadcn/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@ui/shadcn/components/ui/dialog';
import { Input } from '@ui/shadcn/components/ui/input';
import { Label } from '@ui/shadcn/components/ui/label';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from '@ui/shadcn/components/ui/sheet';
import { Switch } from '@ui/shadcn/components/ui/switch';


const meta: Meta = {
  title: 'Gallery/Shadcn/Elements',
};

export default meta;

export const AllElements: StoryObj = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <h2 className="mb-2 text-lg font-semibold">Button</h2>
        <Button>Primary</Button>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Alert</h2>
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the cli.
          </AlertDescription>
        </Alert>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Avatar</h2>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Badge</h2>
        <Badge>Badge</Badge>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Card</h2>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Dialog</h2>
        <Dialog>
          <DialogTrigger>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Input</h2>
        <Input type="email" placeholder="Email" />
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Label</h2>
        <Label htmlFor="email">Your email address</Label>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Sheet</h2>
        <Sheet>
          <SheetTrigger>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold">Switch</h2>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </div>
    </div>
  ),
};
