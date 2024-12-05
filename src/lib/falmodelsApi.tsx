import { fal } from "@fal-ai/client";
fal.config({
  proxyUrl: "/api/bgremove",
});
export const imageGenerator = async (url: any) => {
  const result = await fal.subscribe("fal-ai/imageutils/rembg", {
    input: {
      image_url: url,
    },

    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log("queue update", update);
      }
    },
  });

  return result;

  //   const imageUrl = result.images[0].url;
};
