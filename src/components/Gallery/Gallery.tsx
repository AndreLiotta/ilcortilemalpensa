import {
  Image,
  Flex,
  Box,
  Grid,
  GridItem,
  Text,
  Icon,
  Button,
} from "@chakra-ui/react";
import doubleRoom from "../../assets/doubleRoom.webp";
import double1 from "../../assets/double1.webp";
import double2 from "../../assets/double2.webp";
import double3 from "../../assets/double3.webp";
import double4 from "../../assets/double4.webp";
import double5 from "../../assets/double5.webp";
import double6 from "../../assets/double6.webp";

import familyRoom from "../../assets/familyRoom.webp";
import family1 from "../../assets/family1.webp";
import family2 from "../../assets/family2.webp";
import family3 from "../../assets/family3.webp";
import family4 from "../../assets/family4.webp";
import family5 from "../../assets/family5.webp";
import family6 from "../../assets/family6.webp";
import family7 from "../../assets/family7.webp";
import family8 from "../../assets/family8.webp";
import family9 from "../../assets/family9.webp";

import Giardino1 from "../../assets/HeroImg.webp";
import Giardino2 from "../../assets/Gallery/giardino2.webp";
import Giardino3 from "../../assets/Gallery/giardino3.webp";
import Giardino4 from "../../assets/Gallery/giardino4.webp";
import Giardino5 from "../../assets/Gallery/giardino5.webp";
import Giardino6 from "../../assets/Gallery/giardino6.webp";
import Giardino7 from "../../assets/Gallery/giardino7.webp";
import Giardino8 from "../../assets/Gallery/giardino8.webp";
import Giardino9 from "../../assets/Gallery/giardino9.webp";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { backgroundBrown, headings, accent, displayFont, borderLight } from "../../Colors";
import "./Gallery.css";
import Footer from "../Footer/Footer";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const ArrowLeftIcon = FiArrowLeft as React.ElementType;

interface GalleryItem {
  src: string;
  title: string;
  isPic: boolean;
}

const pictures: GalleryItem[] = [
  { src: "", title: "doubleRoomTitle", isPic: false },
  { src: double3, title: "doubleRoomTitle", isPic: true },
  { src: doubleRoom, title: "doubleRoomTitle", isPic: true },
  { src: double2, title: "doubleRoomTitle", isPic: true },
  { src: double1, title: "doubleRoomTitle", isPic: true },
  { src: double4, title: "doubleRoomTitle", isPic: true },
  { src: double5, title: "doubleRoomTitle", isPic: true },
  { src: double6, title: "doubleRoomTitle", isPic: true },
  { src: "", title: "familyRoomTitle", isPic: false },
  { src: familyRoom, title: "familyRoomTitle", isPic: true },
  { src: family1, title: "familyRoomTitle", isPic: true },
  { src: family2, title: "familyRoomTitle", isPic: true },
  { src: family3, title: "familyRoomTitle", isPic: true },
  { src: family4, title: "familyRoomTitle", isPic: true },
  { src: family5, title: "familyRoomTitle", isPic: true },
  { src: family6, title: "familyRoomTitle", isPic: true },
  { src: family7, title: "familyRoomTitle", isPic: true },
  { src: family8, title: "familyRoomTitle", isPic: true },
  { src: family9, title: "familyRoomTitle", isPic: true },
  { src: "", title: "outside", isPic: false },
  { src: Giardino1, title: "outside", isPic: true },
  { src: Giardino2, title: "outside", isPic: true },
  { src: Giardino3, title: "outside", isPic: true },
  { src: Giardino4, title: "outside", isPic: true },
  { src: Giardino5, title: "outside", isPic: true },
  { src: Giardino6, title: "outside", isPic: true },
  { src: Giardino7, title: "outside", isPic: true },
  { src: Giardino8, title: "outside", isPic: true },
  { src: Giardino9, title: "outside", isPic: true },
];

export default function Gallery() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  return (
    <Box w="full" minH="100vh" bgColor={backgroundBrown}>
      {/* Top bar */}
      <Flex
        alignItems="center"
        px={{ base: "4", md: "8" }}
        py="5"
        bg={backgroundBrown}
        position="sticky"
        top="0"
        zIndex="100"
        borderBottom="1px solid"
        borderColor={borderLight}
      >
        <Button
          variant="ghost"
          aria-label="Back to home"
          onClick={() => navigate(`/${lang}/`)}
          _hover={{ color: accent }}
          transition="color 0.3s"
          color={headings}
          mr="6"
          p="0"
          minW="auto"
        >
          <Icon as={ArrowLeftIcon} w={6} h={6} />
        </Button>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontFamily={displayFont}
          color={headings}
        >
          {t("gallery")}
        </Text>
      </Flex>

      {/* Gallery grid */}
      <Box px={{ base: "2", md: "8" }} py={{ base: "4", md: "8" }}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={{ base: "2", md: "4" }}
          maxW="1200px"
          mx="auto"
        >
          {pictures.map((pic, index) => renderPicOrTitle(pic, index))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}

function renderPicOrTitle(pic: GalleryItem, index: number) {
  if (pic.isPic) {
    return (
      <GridItem key={index}>
        <GalleryPicture img={pic.src} title={pic.title} />
      </GridItem>
    );
  } else {
    return (
      <GridItem
        key={index}
        colSpan={{ base: 2, md: 3 }}
        py={{ base: "4", md: "6" }}
      >
        <Flex alignItems="center" justifyContent="center" gap="4">
          <Box w="30px" h="1px" bg={accent} />
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontFamily={displayFont}
            color={headings}
          >
            {i18n.t(pic.title)}
          </Text>
          <Box w="30px" h="1px" bg={accent} />
        </Flex>
      </GridItem>
    );
  }
}

function GalleryPicture({ img, title }: { img: string; title: string }) {
  const initialRef = React.useRef(null);
  const { t } = useTranslation();
  return (
    <Box
      className="gallery-item"
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      ref={initialRef}
    >
      <Image
        src={img}
        alt={`${t(title)} — B&B Il Cortile Malpensa`}
        width="100%"
        height="100%"
        objectFit="cover"
        transition="transform 0.5s ease"
        className="gallery-image"
        style={{ aspectRatio: "4/3" }}
        loading="lazy"
      />
    </Box>
  );
}
