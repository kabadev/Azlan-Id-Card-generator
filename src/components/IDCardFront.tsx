import Image from "next/image";
import React from "react";

const CardFront = ({ Url }: any) => {
  return (
    <div className="h-[220px] w-1/2 rounded-md overflow-hidden ">
      <Image
        height={500}
        width={500}
        className="absolute top-0 right-0 bottom-0 left-0"
        src={Url}
        alt=""
      />
    </div>
  );
};

export default CardFront;
