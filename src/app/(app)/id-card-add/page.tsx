"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { districts } from "@/constants/menu";
import { useRiderContext } from "@/context/riderContext";
import Image from "next/image";
import { generateCardBack, generateCardFront } from "@/lib/help";

const formSchema = z.object({
  surname: z
    .string()
    .min(2, { message: "Surname must be at least 2 characters." }),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  sex: z.enum(["Male", "Female"]),
  district: z.string().min(2, { message: "District is required." }),
  dateOfBirth: z.string({ required_error: "Date of birth is required." }),
  park: z.string().min(2, { message: "Park is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function AddRiderForm() {
  const { riders, addRider } = useRiderContext();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newRiderinfo, setNewRiderinfo] = useState<any>({});
  const [cardFront, setCardFront] = useState<any>("");
  const [cardBack, setCardBack] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedFields = watch();

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const countId = riders.length + 1;
    setNewRiderinfo({
      id:
        "CBR" +
        "-" +
        watchedFields.district?.slice(0, 3).toUpperCase() +
        "-" +
        countId,
      surname: watchedFields.surname,
      firstName: watchedFields.firstName,
      middleName: watchedFields.middleName,
      sex: watchedFields.sex,
      district: watchedFields.district,
      city: "",
      dateOfBirth: watchedFields.dateOfBirth,
      park: watchedFields.park,
      RIN: "",
      photo: imagePreview,
    });
  }, [
    watchedFields.surname,
    watchedFields.firstName,
    watchedFields.middleName,
    watchedFields.sex,
    watchedFields.district,
    watchedFields.dateOfBirth,
    watchedFields.park,
    imagePreview,
  ]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const countId = riders.length + 1;
    const newRiderData: any = {
      id: "CBR" + "-" + data.district.slice(0, 3).toUpperCase() + "-" + countId,
      surname: data.surname,
      firstName: data.firstName,
      middleName: data.middleName,
      sex: data.sex,
      district: data.district,
      city: "",
      dateOfBirth: data.dateOfBirth,
      park: data.park,
      RIN: "",
      photo: imagePreview,
    };

    addRider(newRiderData);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    reset();
    setImagePreview(null);
    setCardFront("");
    setCardBack("");
    toast({
      title: "Rider Added",
      description: "The new rider has been successfully added to the system.",
    });
  };

  const fetchCard = async () => {
    const front = await generateCardFront(newRiderinfo);
    const back = await generateCardBack(newRiderinfo);

    setCardFront(front);
    setCardBack(back);
  };

  useEffect(() => {
    fetchCard();
  }, [newRiderinfo, generateCardBack, generateCardFront]);

  return (
    <div className="flex h-[calc(100vh-70px)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 pb-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Add New Rider</h2>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Surname */}
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" {...register("surname")} />
              {errors.surname && (
                <p className="text-sm text-red-500">{errors.surname.message}</p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...register("middleName")} />
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label>Sex</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setValue("sex", value as "Male" | "Female")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
              {errors.sex && (
                <p className="text-sm text-red-500">{errors.sex.message}</p>
              )}
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <select
                id="district"
                {...register("district")}
                className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-sm text-red-500">
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* park Name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">Park</Label>
              <Input id="middleName" {...register("park")} />
            </div>
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" id="middleName" {...register("dateOfBirth")} />

              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Rider...
              </>
            ) : (
              "Add Rider"
            )}
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {newRiderinfo && (
          <div className="space-y-6">
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
                src={cardBack ? cardBack : "/backbg1.png"}
                alt=""
              />
            </div>

            {/* Student Details */}
            <div className="w-full rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Rider Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {`${newRiderinfo.firstName} ${
                      newRiderinfo.middleName ? newRiderinfo.middleName : ""
                    } ${newRiderinfo.surname}`}{" "}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{newRiderinfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{newRiderinfo.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Park</p>
                  <p className="font-medium">{newRiderinfo.park}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{newRiderinfo.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sex</p>
                  <p className="font-medium">{newRiderinfo.sex}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{newRiderinfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{newRiderinfo.address}</p>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
