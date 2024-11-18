import Image from "next/image";
import React from "react";

const CardBack = ({ Url }: any) => {
  return (
    <div className="!h-[220px] w-1/2 relative ">
      <Image
        height={500}
        width={500}
        className="!absolute h-[220px] !top-0 right-0 bottom-0 left-0"
        src={Url}
        alt=""
      />
    </div>
  );
};

export default CardBack;
