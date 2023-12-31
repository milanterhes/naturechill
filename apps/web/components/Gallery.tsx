import React, { useState, MouseEventHandler, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import { AnimatePresence, motion } from "framer-motion";

export const GalleryIntro = () => {
  const t = useTranslations();
  const [shouldDisplay, setShouldDisplay] = useState(false);

  useEffect(() => {
    setShouldDisplay(true);
  }, []);
  return (
    <AnimatePresence>
      <div className="relative h-screen w-screen overflow-hidden">
        {shouldDisplay && window.innerWidth >= 768 && (
          <iframe
            className="top-50 left-50 -translate-x-50% -translate-y-50% absolute h-auto min-h-full w-auto min-w-full transform"
            src="https://www.youtube.com/embed/pY2CWYxUbrM?start=60&autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=pY2CWYxUbrM"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 text-center">
          <div>
            <motion.h1
              className="mb-4 text-3xl text-white lg:text-5xl"
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.75,
              }}
            >
              {t.rich(`gallery.hero.title`, {
                large: (chunks) => (
                  <span className="text-5xl lg:text-7xl">{chunks}</span>
                ),
              })}
            </motion.h1>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

type ImageGridItemProps = {
  src: string;
  alt: string;
  className?: string;
  onClick: () => void;
};

const ImageGridItem: React.FC<ImageGridItemProps> = ({
  src,
  alt,
  className,
  onClick,
}) => (
  <div onClick={onClick} className={`relative h-full rounded ${className}`}>
    <Image
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "cover" }}
      className="rounded"
    />
  </div>
);
const SlideshowLightboxComponent = SlideshowLightbox as React.ElementType;
const images = [
  {
    src: "/slideshow1.webp",
    alt: "Gallery slideshow image 1 - Entrance gate for Nature Chill Woodhouses",
  },
  {
    src: "/slideshow2.webp",
    alt: "Gallery slideshow image 2 - Grill & Chill in Nature Chill Woodhouses",
  },
  {
    src: "/slideshow3.webp",
    alt: "Gallery slideshow image 3 - Animals are allowed to relax at Nature Chill Woodhouses",
  },
  {
    src: "/slideshow4.webp",
    alt: "Gallery slideshow image 4 - Jaccuzzi & Chill in Nature Chill Woodhouses",
  },
  {
    src: "/slideshow5.webp",
    alt: "Gallery slideshow image 5 - Jaccuzzi & Chill in Nature Chill Woodhouses",
  },
  {
    src: "/slideshow6.webp",
    alt: "Gallery slideshow image 6 - Interior at Nature Chill Woodhouses",
  },
  {
    src: "/slideshow7.webp",
    alt: "Gallery slideshow image 7 - Interior design at Nature Chill Woodhouses",
  },
  {
    src: "/slideshow8.webp",
    alt: "Gallery slideshow image 8 - Interior design at Nature Chill Woodhouses",
  },
  {
    src: "/slideshow9.webp",
    alt: "Gallery slideshow image 9 - Interior design at Nature Chill Woodhouses",
  },
];

export const GalleryGrid = () => {
  let [isOpen, setIsOpen] = useState(false);
  let [startingIndex, setStartingIndex] = useState(0);
  const t = useTranslations();
  useEffect(() => {
    initLightboxJS(`${process.env.NEXT_PUBLIC_LIGHTBOX_KEY}`, "individual");
  });

  const handleImageClick = (index) => {
    setStartingIndex(index);
    setIsOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="relative flex w-full justify-center">
        <SlideshowLightboxComponent
          open={isOpen}
          startingSlideIndex={startingIndex}
          onClose={() => setIsOpen(false)}
          lightboxIdentifier="lbox1"
          theme="lightbox"
          iconColor="#DDA771"
          images={images}
        />
        <motion.div
          className="my-10 grid h-screen w-full grid-cols-2 grid-rows-6 gap-4 p-4 md:w-11/12 md:grid-cols-3 md:grid-rows-4 md:p-10"
          initial={{ y: 25, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.75,
          }}
          viewport={{ once: true }}
        >
          <ImageGridItem
            src="/gal1.webp"
            alt="Image 1"
            className="col-span-2 row-span-6 rounded md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-4"
            onClick={() => handleImageClick(0)}
          />
          <ImageGridItem
            src="/gal2.webp"
            alt="Image 2"
            className="col-start-1 col-end-2 rounded md:col-start-1 md:col-end-2 md:row-start-4 md:row-end-5"
            onClick={() => handleImageClick(1)}
          />
          <ImageGridItem
            src="/gal3.webp"
            alt="Image 3"
            className="col-start-2 col-end-3 row-span-1 rounded md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2"
            onClick={() => handleImageClick(2)}
          />
          <ImageGridItem
            src="/gal4.webp"
            alt="Image 4"
            className="col-span-2 row-start-3 row-end-4 rounded md:col-start-2 md:col-end-4 md:row-start-2 md:row-end-3"
            onClick={() => handleImageClick(3)}
          />
          <motion.div
            className="row-start-4 row-end-5 flex gap-2 rounded bg-main-theme md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4"
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.75,
            }}
            viewport={{ once: true }}
          >
            <ImageGridItem
              src="/gal5.webp"
              alt="Image 5"
              className="h-full w-1/2 rounded"
              onClick={() => handleImageClick(4)}
            />
            <ImageGridItem
              src="/gal6.webp"
              alt="Image 6"
              className="h-full w-1/2 rounded"
              onClick={() => handleImageClick(5)}
            />
          </motion.div>
          <ImageGridItem
            src="/gal7.webp"
            alt="Image 7"
            className="col-start-1 col-end-2 row-start-5 row-end-7 rounded md:col-start-2 md:col-end-3 md:row-start-4 md:row-end-5"
            onClick={() => handleImageClick(6)}
          />
          <ImageGridItem
            src="/gal8.webp"
            alt="Image 8"
            className="col-start-1 col-end-3 row-start-1 row-end-3 rounded md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2"
            onClick={() => handleImageClick(7)}
          />
          <ImageGridItem
            src="/gal9.webp"
            alt="Image 9"
            className="col-start-2 col-end-3 row-start-4 row-end-7 rounded md:col-start-3 md:col-end-4 md:row-start-3 md:row-end-5"
            onClick={() => handleImageClick(8)}
          />
        </motion.div>
      </div>
      <motion.div
        className="mx-auto mb-20 mt-10 flex flex-col items-center space-y-4 bg-secondary-theme bg-opacity-30 py-2 text-center text-lg md:text-xl lg:text-2xl xl:text-3xl"
        initial={{ y: 25, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.4,
          duration: 0.75,
        }}
        viewport={{ once: true }}
      >
        <h2>{t("gallery.cta.title")}</h2>
        <div className="flex space-x-4">
          <motion.a
            href="https://www.instagram.com/naturechilltreehouses//"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.75,
            }}
            viewport={{ once: true }}
          >
            <Image
              src={"/instagram.svg"}
              alt="Follow us on Instagram"
              width={15}
              height={15}
            />
          </motion.a>
          <motion.a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 25, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.75,
            }}
            viewport={{ once: true }}
          >
            <Image
              src={"/facebook.svg"}
              alt="Follow us on Facebook"
              width={15}
              height={15}
            />
          </motion.a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
