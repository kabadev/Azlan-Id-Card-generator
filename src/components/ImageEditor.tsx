"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
// import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
// import { IoMdUndo, IoMdRedo, IoIosImage } from "react-icons/io";
// import { MdOutlineHideImage } from "react-icons/md";
import { storeData } from "@/lib/LinkedList";
import {
  CropIcon,
  FlipHorizontal2,
  FlipVertical2,
  ImageDown,
  ImagePlus,
  Redo,
  RotateCcw,
  RotateCw,
  Undo,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { imageGenerator } from "@/lib/falmodelsApi";
import { dataURLtoBlob } from "@/lib/help";
import axios from "axios";

interface FilterElement {
  name: string;
  maxValue: number;
}

interface State {
  image: string;
  brightness: number;
  grayscale: number;
  sepia: number;
  saturate: number;
  contrast: number;
  hueRotate: number;
  rotate: number;
  vertical: number;
  horizontal: number;
}

const filterElements: FilterElement[] = [
  { name: "brightness", maxValue: 200 },
  { name: "grayscale", maxValue: 200 },
  { name: "sepia", maxValue: 200 },
  { name: "saturate", maxValue: 200 },
  { name: "contrast", maxValue: 200 },
  { name: "hueRotate", maxValue: 360 },
];

const ImageEditor = ({
  rider,
  onCloseEditPhoto,
  setSelectedRider,
}: {
  rider: any;
  onCloseEditPhoto: any;
  setSelectedRider: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [property, setProperty] = useState<FilterElement>(filterElements[0]);
  const [details, setDetails] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 60,
    x: 25,
    y: 25,
    // aspect: 1 / 1,
  });
  const [showCrop, setShowCrop] = useState(false);
  const [state, setState] = useState<State>({
    image: rider?.photo,
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        image: rider?.photo as string,
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vertical: 1,
        horizontal: 1,
      };
      storeData.insert(newState);
      return newState;
    });
  }, [rider]);

  const uploadToCloudinary = async (bseurl: any) => {
    const blob = dataURLtoBlob(bseurl);
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

  const inputHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: Number(e.target.value),
    });
  };

  const leftRotate = () => {
    setState((prevState) => {
      const newState = { ...prevState, rotate: prevState.rotate - 90 };
      storeData.insert(newState);
      return newState;
    });
  };

  const rightRotate = () => {
    setState((prevState) => {
      const newState = { ...prevState, rotate: prevState.rotate + 90 };
      storeData.insert(newState);
      return newState;
    });
  };

  const verticalFlip = () => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        vertical: prevState.vertical === 1 ? -1 : 1,
      };
      storeData.insert(newState);
      return newState;
    });
  };

  const horizontalFlip = () => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        horizontal: prevState.horizontal === 1 ? -1 : 1,
      };
      storeData.insert(newState);
      return newState;
    });
  };

  const redo = () => {
    const data = storeData.redoEdit();
    if (data) {
      setState(data);
    }
  };

  const undo = () => {
    const data = storeData.undoEdit();
    if (data) {
      setState(data);
    }
  };

  const CropImage = () => {
    setShowCrop(true);
    console.log(details);
  };

  const imageCrop = () => {
    if (details && crop) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = details.src;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / details.width;
        const scaleY = image.naturalHeight / details.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          try {
            ctx.fillStyle = "white"; // Prevent transparency
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(
              image,
              crop.x * scaleX,
              crop.y * scaleY,
              crop.width * scaleX,
              crop.height * scaleY,
              0,
              0,
              crop.width,
              crop.height
            );

            const base64Url = canvas.toDataURL("image/jpg");
            console.log("Cropped Image URL:", base64Url);

            setShowCrop(false);
            setState((prevState) => ({
              ...prevState,
              image: base64Url,
            }));
          } catch (error) {
            console.error("Error exporting cropped image:", error);
          }
        }
      };

      image.onerror = () => {
        console.error(
          "Image failed to load. Ensure it has proper CORS headers."
        );
      };
    }
  };

  const saveImage = async () => {
    setSaving(true);
    if (details) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = details.src;

      image.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.filter = `brightness(${state.brightness}%) brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;

          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((state.rotate * Math.PI) / 180);
          ctx.scale(state.vertical, state.horizontal);

          ctx.drawImage(
            image,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          );

          const bseurl = canvas.toDataURL("image/jpg");
          const photoUploaded = await uploadToCloudinary(bseurl);

          await axios.post("/api/riders/updateRidersPrinted", {
            id: rider.id,
            photo: photoUploaded.url,
            imageId: photoUploaded.publicId,
          });

          setSelectedRider({ ...rider, photo: photoUploaded.url });
          setState({
            image: rider?.photo,
            brightness: 100,
            grayscale: 0,
            sepia: 0,
            saturate: 100,
            contrast: 100,
            hueRotate: 0,
            rotate: 0,
            vertical: 1,
            horizontal: 1,
          });
          setSaving(false);
          setShowCrop(false);
          window.location.reload();
          // const link = document.createElement("a");
          // link.download = "image_edit.jpg";
          // link.href = canvas.toDataURL("image/png");
          // link.click();
        }
      };

      image.onerror = () => {
        console.error(
          "Image failed to load. Ensure it has proper CORS headers."
        );
      };
    }
  };

  const removeBackground = async () => {
    if (!state.image) return;

    setIsRemoving(true);

    try {
      const result: any = await imageGenerator(state.image);

      setState((prevState) => ({
        ...prevState,
        image: result?.data?.image?.url,
      }));
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Failed to remove background. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };
  const resetEdit = () => {
    setState({
      image: rider?.photo,
      brightness: 100,
      grayscale: 0,
      sepia: 0,
      saturate: 100,
      contrast: 100,
      hueRotate: 0,
      rotate: 0,
      vertical: 1,
      horizontal: 1,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-2">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className=" border-b p-4 text-center">
          <h2 className="text-2xl font-bold">Edit Rider photo </h2>
        </div>
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-full md:w-[50%] p-4 bg-gray-50">
            <div className="mb-6">
              <span className="block text-lg font-semibold mb-2">Filters</span>
              <div className="grid grid-cols-2 gap-2">
                {filterElements.map((v, i) => (
                  <button
                    key={i}
                    className={`py-2 px-4 rounded ${
                      property.name === v.name
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setProperty(v)}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="range" className="font-medium">
                  {property.name}
                </label>
                <span>{state[property.name as keyof State]}%</span>
              </div>
              <input
                name={property.name}
                onChange={inputHandle}
                value={state[property.name as keyof State]}
                max={property.maxValue}
                type="range"
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2">Rotate & Flip</label>
              <div className="flex justify-between">
                <button
                  onClick={leftRotate}
                  className="p-2 bg-gray-200 rounded"
                >
                  <RotateCcw />
                </button>
                <button
                  onClick={rightRotate}
                  className="p-2 bg-gray-200 rounded"
                >
                  <RotateCw />
                </button>
                <button
                  onClick={verticalFlip}
                  className="p-2 bg-gray-200 rounded"
                >
                  <FlipHorizontal2 />
                </button>
                <button
                  onClick={horizontalFlip}
                  className="p-2 bg-gray-200 rounded"
                >
                  <FlipVertical2 />
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={onCloseEditPhoto}
                className="bg-gray-500 text-white py-2 px-4 flex items-center gap-1 rounded"
              >
                <span className="text-xs">Cancel</span>
              </button>
              <button
                onClick={resetEdit}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                <span className="text-xs">Reset</span>
              </button>
              <Button
                disabled={isSaving}
                onClick={saveImage}
                className=" text-white py-2 px-4 rounded"
              >
                <span className="text-xs">
                  {isSaving ? "Saving..." : "Save Changes"}
                </span>
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={undo} className="p-2 bg-gray-200 rounded">
                <Undo />
              </button>
              <button onClick={redo} className="p-2 bg-gray-200 rounded">
                <Redo />
              </button>
            </div>
          </div>
          <div className="w-full md:w-[60%] h-fit p-4">
            <div
              className="mb-4 rounded-lg overflow-hidden"
              style={{ minHeight: "400px" }}
            >
              {showCrop ? (
                <ReactCrop
                  className="w-full"
                  crop={crop}
                  onChange={(c: any) => setCrop(c)}
                >
                  <img
                    onLoad={(e) => setDetails(e.currentTarget)}
                    style={{
                      filter: `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`,
                      transform: `rotate(${state.rotate}deg) scale(${state.vertical},${state.horizontal})`,
                    }}
                    src={state.image}
                    alt=""
                    className=" h-auto w-full"
                  />
                </ReactCrop>
              ) : (
                <img
                  onLoad={(e) => setDetails(e.currentTarget)}
                  style={{
                    filter: `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`,
                    transform: `rotate(${state.rotate}deg) scale(${state.vertical},${state.horizontal})`,
                  }}
                  src={state.image}
                  alt=""
                  className=" h-auto w-full"
                />
              )}
            </div>
            <div className="flex justify-between items-center gap-2">
              {!showCrop ? (
                <Button
                  onClick={CropImage}
                  className="bg-gray-500  py-2 px-4 rounded"
                >
                  <CropIcon /> Crop
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => setShowCrop(false)}
                    className=" py-2 px-4 rounded"
                  >
                    <X />
                    Cancel
                  </Button>
                  <Button
                    onClick={imageCrop}
                    className="bg-gray-500  py-2 px-4 rounded"
                  >
                    <CropIcon />
                    Done
                  </Button>
                </div>
              )}

              <Button
                variant={"outline"}
                onClick={removeBackground}
                disabled={!state.image || isRemoving}
                className={`flex items-center space-x-2 bg-gray-200 py-2 px-4 rounded-none ${
                  !state.image || isRemoving
                    ? "bg-gray-300 cursor-not-allowed"
                    : ""
                }`}
              >
                <ImageDown />
                <span>{isRemoving ? "Removing..." : "RemBg"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
