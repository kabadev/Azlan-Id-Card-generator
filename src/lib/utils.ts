import Rider from "@/models/Rider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mongooseConnect } from "./mongoose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateNextId = async (): Promise<string> => {
  mongooseConnect();
  const latestItem = await Rider.findOne().sort({ id: -1 }).exec();
  const prefix = "BRU24";

  if (!latestItem) {
    return `${prefix}000001`;
  }

  const currentId = latestItem.id;
  const numberPart = currentId.slice(prefix.length);
  const incrementedNumber = parseInt(numberPart, 10) + 1;

  if (incrementedNumber > 500000) {
    throw new Error("Maximum ID limit reached");
  }

  const newNumberPart = incrementedNumber
    .toString()
    .padStart(numberPart.length, "0");
  return `${prefix}${newNumberPart}`;
};
