import {
  Image,
  Flex,
  Box,
  Grid,
  GridItem,
  Text,
  Icon,
} from "@chakra-ui/react";
import doubleRoom from "../../assets/doubleRoom.jpg";
import double1 from "../../assets/double1.jpg";
import double2 from "../../assets/double2.jpg";
import double3 from "../../assets/double3.jpg";
import double4 from "../../assets/double4.jpg";
import double5 from "../../assets/double5.jpg";
import double6 from "../../assets/double6.jpg";

import familyRoom from "../../assets/familyRoom.jpg";
import family1 from "../../assets/family1.jpg";
import family2 from "../../assets/family2.jpg";
import family3 from "../../assets/family3.jpg";
import family4 from "../../assets/family4.jpg";
import family5 from "../../assets/family5.jpg";
import family6 from "../../assets/family6.jpg";
import family7 from "../../assets/family7.jpg";
import family8 from "../../assets/family8.jpg";
import family9 from "../../assets/family9.jpg";

import Giardino1 from "../../assets/HeroImg.jpg";
import Giardino2 from "../../assets/Gallery/giardino2.jpg";
import Giardino3 from "../../assets/Gallery/giardino3.jpg";
import Giardino4 from "../../assets/Gallery/giardino4.jpg";
import Giardino5 from "../../assets/Gallery/giardino5.jpg";
import Giardino6 from "../../assets/Gallery/giardino6.jpg";
import Giardino7 from "../../assets/Gallery/giardino7.jpg";
import Giardino8 from "../../assets/Gallery/giardino8.jpg";
import Giardino9 from "../../assets/Gallery/giardino9.jpg";

import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { backgroundBrown, headings, accent, displayFont } from "../../Colors";
import "./Gallery.css";
import Footer from "../Footer/Footer";
import backButtonIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import React from "react";

const pictures: any[] = [
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
        borderColor="#E8E3D8"
      >
        <Flex
          alignItems="center"
          cursor="pointer"
          onClick={() => navigate(-1)}
          _hover={{ color: accent }}
          transition="color 0.3s"
          color={headings}
          mr="6"
        >
          <Icon as={backButtonIcon} w={6} h={6} />
        </Flex>
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

function renderPicOrTitle(pic: any, index: number) {
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
      />
      <Box
        className="gallery-overlay"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(59, 74, 43, 0.3)"
        opacity="0"
        transition="opacity 0.4s ease"
        display="flex"
        alignItems="center"
        justifyContent="center"
      />
    </Box>
  );
}
