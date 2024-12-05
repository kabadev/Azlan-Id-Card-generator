"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { toast } from "@/hooks/use-toast";
import { districts } from "@/constants/menu";
import { useRiderContext } from "@/context/riderContext";
import Image from "next/image";
import { dataURLtoBlob, resizeImage } from "@/lib/help";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Value } from "@radix-ui/react-select";
import { usePathname, useRouter } from "next/navigation";

const formSchema = z.object({
  surName: z
    .string()
    .min(2, { message: "Surname must be at least 2 characters." }),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  sex: z.enum(["Male", "Female"]),
  district: z.string().min(2, { message: "District is required." }),
  type: z.string().min(2, { message: "ID Card type is required." }),
  dateOfBirth: z.string({ required_error: "Date of birth is required." }),
  park: z.string().min(2, { message: "Park is required." }),
  designation: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function EditRiderForm({
  rider,
  onCloseForm,
  setSelectedRider,
}: {
  rider: any;
  onCloseForm: any;
  setSelectedRider: React.Dispatch<React.SetStateAction<any>>;
}) {
  const { user } = useUser();
  const { updateRider } = useRiderContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    rider?.photo || null
  );
  const [imageReqError, setImageReqError] = useState<any>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: rider,
  });

  const watchedFields = watch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    try {
      setImageReqError("");
      const resizedImage = await resizeImage(file, 300, 300);
      setImagePreview(resizedImage);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  const uploadToCloudinary = async () => {
    if (!imagePreview) {
      setImageReqError("Rider Photo is required");
      return;
    }
    const blob = dataURLtoBlob(imagePreview);
    const formData = new FormData();
    formData.append("file", blob);

    try {
      const response = await axios.post("/api/upload", formData);
      const imagedata = response.data;
      return imagedata;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const newRiderData: any = {
        id: rider.id,
        surName: data.surName,
        firstName: data.firstName,
        middleName: data.middleName,
        sex: data.sex,
        district: data.district,
        dateOfBirth: data.dateOfBirth,
        park: data.park,
        userId: user?.id,
        type: data.type,
        designation: data.designation,
      };
      if (rider.photo !== imagePreview) {
        const photoUploaded = await uploadToCloudinary();
        (newRiderData.photo = photoUploaded.url),
          (newRiderData.imageId = photoUploaded.publicId);
      }

      await updateRider(newRiderData);
      setIsSubmitting(false);
      setSelectedRider(newRiderData);
      onCloseForm();
      window.location.reload();
    } catch (error) {
      console.log("Fail to add rider info:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-y-auto ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-center ">Edit Rider Details</h2>
          <Button onClick={onCloseForm} variant={"ghost"}>
            <X />
          </Button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Surname */}
          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input
              placeholder="Eg. Sillah"
              id="surname"
              {...register("surName")}
            />
            {errors.surName && (
              <p className="text-sm text-red-500">{errors.surName.message}</p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              placeholder="Eg. Abu"
              id="firstName"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name (Optional)</Label>
            <Input
              placeholder="Eg. John"
              id="middleName"
              {...register("middleName")}
            />
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
              <option value="" disabled={true}>
                Select a district
              </option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-sm text-red-500">{errors.district.message}</p>
            )}
          </div>

          {/* park Name */}
          <div className="space-y-2">
            <Label htmlFor="park">Park</Label>
            <Input
              placeholder="Eg Lumley Park"
              id="park"
              {...register("park")}
            />
          </div>
          {/* Date of Birth */}
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              value={watchedFields.dateOfBirth.slice(0, 10)}
              type="date"
              id="dob"
              {...register("dateOfBirth")}
            />

            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* District */}
          <div className="space-y-2">
            <Label htmlFor="type">ID Card Type</Label>
            <select
              id="type"
              {...register("type")}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled={true}>
                Select a ID Card Type
              </option>

              <option value="General">General Member</option>
              <option value="Executive">Executive Member</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Position*/}
          {watchedFields.type === "Executive" && (
            <div className="space-y-2">
              <Label htmlFor="Designation">Designation</Label>
              <Input
                placeholder="Designation: Eg. Chairman"
                id="Designation"
                {...register("designation")}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Upload Photo</Label>
              {imageReqError && (
                <p className="text-sm text-red-500">{imageReqError}</p>
              )}
              <div className="w-32 p-2 h-36 bg-accent rounded-sm relative flex flex-col items-center justify-center">
                <Upload />
                <span className="text-xs text-center">
                  Click or Drang and Drop
                </span>
                <Input
                  className="absolute top-0 bottom-0 left-0 right-0 z-10 opacity-0 cursor-pointer h-full w-full"
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {imagePreview && (
                  <div className=" absolute top-0 bottom-0 left-0 right-0 h-full w-full bg-background">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-36 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-9" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Rider...
            </>
          ) : (
            "Update Rider"
          )}
        </Button>
      </form>
    </div>
  );
}
