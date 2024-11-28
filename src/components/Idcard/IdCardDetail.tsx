"use client";

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Download, Edit, MoreVertical, Printer, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  generateCardBack,
  generateCardFront,
  generateExCardBack,
  generateExCardFront,
  printSingleIDCard,
  saveSingleIDCard,
} from "@/lib/help";
import EditRiderForm from "./IdCardEditForm";

export default function IdCardDetail({ rider }: { rider: any }) {
  const [issaving, setIssaving] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardFront, setCardFront] = React.useState<any>("");
  const [cardBack, setCardBack] = React.useState<any>("");
  const [pcardFront, setPCardFront] = React.useState<any>("");
  const [pcardBack, setPCardBack] = React.useState<any>("");

  const CloseRiderEditForm = () => {
    setIsEditing(false);
  };

  const fetchCard = async () => {
    const frontP: any = await generateExCardFront(rider);
    const backP: any = await generateExCardBack(rider);

    const front: any = await generateCardFront(rider);
    const back: any = await generateCardBack(rider);
    setCardFront(front);
    setCardBack(back);
    setPCardFront(frontP);
    setPCardBack(backP);
  };

  React.useEffect(() => {
    fetchCard();
  }, [rider, generateCardBack, generateCardFront]);

  const handleSaveSingle = async () => {
    setIssaving(true);
    const frontPImage: any = await generateExCardFront(rider);
    const backPmage: any = await generateExCardBack(rider);

    const frontImage: any = await generateCardFront(rider);
    const backImage: any = await generateCardBack(rider);

    if (rider.type !== "General") {
      await saveSingleIDCard(
        frontImage,
        backImage,
        rider.firstName,
        rider.type,
        frontPImage,
        backPmage
      );
    } else {
      await saveSingleIDCard(
        frontImage,
        backImage,
        rider.firstName,
        rider.type
      );
    }
    setIssaving(false);
  };

  const handlePrintSingle = async () => {
    setIsPrinting(true);
    const frontPImage: any = await generateExCardFront(rider);
    const backPmage: any = await generateExCardBack(rider);

    const frontImage: any = await generateCardFront(rider);
    const backImage: any = await generateCardBack(rider);
    if (rider.type !== "General") {
      await printSingleIDCard(
        frontImage,
        backImage,
        rider.firstName,
        rider.type,
        frontPImage,
        backPmage
      );
    } else {
      await printSingleIDCard(
        frontImage,
        backImage,
        rider.firstName,
        rider.type
      );
    }

    setIsPrinting(false);
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <EditRiderForm onCloseForm={CloseRiderEditForm} rider={rider} />
      ) : (
        <>
          <div>
            <div className="flex gap-4 w-full relative ">
              <Image
                height={500}
                width={500}
                className=" w-1/2 rounded-md shadow-lg"
                src={cardFront ? cardFront : "/frontbg.png"}
                alt=""
              />
              <Image
                height={500}
                width={500}
                className=" w-1/2 rounded-md shadow-lg"
                src={cardBack ? cardBack : "/backbg.png"}
                alt=""
              />
            </div>

            {rider.type === "Executive" && (
              <div className="flex gap-4 w-full relative mt-4 ">
                <Image
                  height={500}
                  width={500}
                  className=" w-1/2 rounded-md shadow-lg"
                  src={pcardFront ? pcardFront : "/frontbg.png"}
                  alt=""
                />
                <Image
                  height={500}
                  width={500}
                  className=" w-1/2 rounded-md shadow-lg"
                  src={pcardBack ? pcardBack : "/backbg.png"}
                  alt=""
                />
              </div>
            )}
          </div>

          {/* Student Details */}
          <div className="w-full rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-x-2">
                <Button onClick={handleSaveSingle} disabled={issaving}>
                  <Download className="mr-2 h-4 w-4" />

                  {issaving ? "Downloading.." : " Download"}
                </Button>

                <Button onClick={handlePrintSingle} disabled={isPrinting}>
                  <Printer className="mr-2 h-4 w-4" />
                  {isPrinting ? "Printing.." : " Print"}
                </Button>
              </div>
              <div className="space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit />
                        <span>Edit</span>
                        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Trash />
                        <span>Delete</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleSaveSingle}
                      >
                        <Download />
                        <span>{issaving ? "Downloading.." : " Download"}</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handlePrintSingle}
                      >
                        <Printer />
                        <span>{isPrinting ? "Printing.." : " Print"}</span>
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <h3 className="text-lg font-semibold">Rider Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {`${rider.firstName} ${
                    rider.middleName ? rider.middleName : ""
                  } ${rider.surName}`}{" "}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{rider.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="font-medium">{rider.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Park</p>
                <p className="font-medium">{rider.park}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {format(new Date(rider?.dateOfBirth), "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sex</p>
                <p className="font-medium">{rider.sex}</p>
              </div>
              {/* <div>
      <p className="text-sm text-gray-500">Email</p>
      <p className="font-medium">{rider.email}</p>
    </div>
    <div>
      <p className="text-sm text-gray-500">Address</p>
      <p className="font-medium">{rider.address}</p>
    </div> */}
            </div>
            <div className=" mt-8 flex md:hidden items-center justify-end">
              <div className="space-x-2">
                <Button onClick={handleSaveSingle} disabled={issaving}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant={"outline"}
                  onClick={handlePrintSingle}
                  disabled={isPrinting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
