"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const lawyerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  specialization: z
    .string()
    .min(2, { message: "Specialization must be at least 2 characters." }),
  avatar: z
    .string()
    .url({ message: "Please enter a valid URL for the avatar." })
    .optional(),
});

const AddUser = () => {
  const [addLawyerModalOpen, setAddLawyerModalOpen] = useState(false);

  const form = useForm<z.infer<typeof lawyerFormSchema>>({
    resolver: zodResolver(lawyerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      specialization: "",
      avatar: "",
    },
  });

  const onSubmit = (data: z.infer<typeof lawyerFormSchema>) => {
    console.log(data);
    // Implement add lawyer functionality here
    setAddLawyerModalOpen(false);
    form.reset();
  };

  return (
    <div>
      <Button onClick={() => setAddLawyerModalOpen(true)}>Add New User</Button>
      <Sheet open={addLawyerModalOpen} onOpenChange={setAddLawyerModalOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[50%]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Add New user</SheetTitle>
            <SheetDescription>Add a new user to the system.</SheetDescription>
          </SheetHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <ScrollArea className="h-[calc(100vh-180px)] px-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  {...form.register("specialization")}
                />
                {form.formState.errors.specialization && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.specialization.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (optional)</Label>
                <Input id="avatar" {...form.register("avatar")} />
                {form.formState.errors.avatar && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.avatar.message}
                  </p>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddLawyerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Lawyer</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddUser;
