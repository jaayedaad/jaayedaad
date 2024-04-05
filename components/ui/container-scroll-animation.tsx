"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.9] : [1.05, 1];
  };

  const scaleRotations = () => {
    return isMobile ? [0, 20] : [20, 0];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.01], scaleRotations());
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      id="preview"
      className="-mt-2 section h-[30rem] md:h-[65rem] md:max-[819px]:h-[65rem] min-[820px]:h-[74rem] lg:h-[86rem] xl:h-[65rem] min-[1440px]:h-[52rem] flex items-center justify-center relative px-2 pb-2 md:px-10 md:pb-10"
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <>
      <motion.div
        style={{
          rotateX: rotate,
          scale,
        }}
        className="max-w-5xl mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#181818] rounded-[30px] shadow-2xl"
      >
        {children}
      </motion.div>
    </>
  );
};
