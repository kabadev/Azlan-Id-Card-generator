"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRiderContext } from "@/context/riderContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteRiderModal({
  rider,
  deleteShow,
  setDeleteShow,
  setSelectedRider,
}: {
  rider: any;
  deleteShow: boolean;
  setDeleteShow: React.Dispatch<React.SetStateAction<any>>;
  setSelectedRider: React.Dispatch<React.SetStateAction<any>>;
}) {
  const router = useRouter();
  const { deleteRider } = useRiderContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRiderHandle = async () => {
    try {
      setIsDeleting(true);
      await deleteRider(rider?.id);
      setIsDeleting(false);
      setDeleteShow(false);
      window.location.reload();
    } catch (error) {
      setIsDeleting(false);
      console.log("Error in Deleting rider", error);
    }
  };

  return (
    <Dialog open={deleteShow} onOpenChange={setDeleteShow}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure to delete ? {rider?.firstName}</DialogTitle>
          <DialogDescription>
            This action will delete the rider data from the server permanently
            and cannot be undo
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={deleteRiderHandle}
            variant="default"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
