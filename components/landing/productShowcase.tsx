import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import linear from "@/public/linear.jpeg";

function ProductShowcase() {
  return (
    <div id="preview" className="section flex flex-col overflow-hidden">
      <ContainerScroll titleComponent>
        <Image
          src={linear}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default ProductShowcase;
