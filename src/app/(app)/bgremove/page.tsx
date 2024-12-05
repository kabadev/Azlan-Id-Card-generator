import { BackgroundRemover } from "@/components/BackgroundRemover";
import ImageEditor from "@/components/ImageEditor";

export default function Home() {
  return (
    <div className="container h-screen overflow-y-auto mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Background Remover (App Router Version)
      </h1>
      {/* <ImageEditor /> */}
      <BackgroundRemover />
    </div>
  );
}
