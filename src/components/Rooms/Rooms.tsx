import { Flex, Text, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { headings, textColor, displayFont, bodyFont, accent } from "../../Colors";
import RoomCard from "../RoomCard/RoomCard";

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

import "../Fonts.css";

const familyRoomCards: string[] = [
  familyRoom,
  family1,
  family2,
  family3,
  family4,
  family5,
  family6,
  family7,
  family8,
  family9,
];

const doubleRoomCards: string[] = [
  doubleRoom,
  double1,
  double2,
  double3,
  double4,
  double5,
  double6
];

export default function Rooms() {
  const { t } = useTranslation();
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={{ base: "12", md: "20" }}
      px="6"
      id="rooms"
      bg="#FAF7F2"
    >
      {/* Section title with decorative line */}
      <Flex alignItems="center" gap="4" mb="4">
        <Box w="40px" h="1px" bg={accent} />
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontFamily={displayFont}
          color={headings}
        >
          {t("rooms")}
        </Text>
        <Box w="40px" h="1px" bg={accent} />
      </Flex>

      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontFamily={bodyFont}
        mb={{ base: "8", md: "12" }}
        width={{ base: "90%", md: "60%" }}
        textAlign="center"
        color={textColor}
        lineHeight="1.8"
      >
        {t("roomsText")}
      </Text>

      {/* Room cards side by side */}
      <Flex
        width={{ base: "100%", md: "90%" }}
        maxW="1200px"
        gap={{ base: "6", md: "8" }}
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
      >
        <RoomCard
          img={doubleRoom}
          text={t("doubleRoomText")}
          title={t("doubleRoomTitle")}
          cards={doubleRoomCards}
          price={t("doubleRoomPrice")}
        />
        <RoomCard
          img={familyRoom}
          text={t("familyRoomText")}
          title={t("familyRoomTitle")}
          cards={familyRoomCards}
          price={t("familyRoomPrice")}
        />
      </Flex>
    </Flex>
  );
}
