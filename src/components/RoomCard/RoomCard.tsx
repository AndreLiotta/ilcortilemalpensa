import {
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  Box,
} from "@chakra-ui/react";
import { backgroundBrown, headings, accent, displayFont, bodyFont, textColor } from "../../Colors";
import "./RoomCard.css";
import { useTranslation } from "react-i18next";
import "../Fonts.css";
import Carousel from "../Carousel/Carousel";

function RoomCard({
  img,
  text,
  title,
  price,
  cards,
}: {
  img: string;
  text: string;
  title: string;
  price: string;
  cards: string[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  return (
    <Box
      className="room-card"
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      shadow="lg"
      width={{ base: "90%", md: "45%" }}
      cursor="pointer"
      onClick={onOpen}
    >
      {/* Image with 16:10 aspect ratio */}
      <Box
        className="room-card-image"
        backgroundImage={`url(${img})`}
        backgroundSize="cover"
        backgroundPosition="center"
        paddingBottom="62.5%"
        transition="transform 0.6s ease"
      />

      {/* Title overlay at bottom-left */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        p={{ base: "4", md: "6" }}
        bgGradient="linear(to-t, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
      >
        <Text
          fontFamily={displayFont}
          fontSize={{ base: "xl", md: "2xl" }}
          color="white"
          textShadow="0 1px 4px rgba(0,0,0,0.4)"
        >
          {title}
        </Text>
      </Box>

      {/* Hover overlay with discover button */}
      <Flex
        className="room-card-overlay"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(59, 74, 43, 0.5)"
        alignItems="center"
        justifyContent="center"
        opacity="0"
        transition="opacity 0.4s ease"
      >
        <Button
          bg={accent}
          color="white"
          borderRadius="full"
          px="8"
          py="6"
          fontFamily={displayFont}
          fontSize={{ base: "md", md: "xl" }}
          _hover={{ bg: "#b5633f" }}
        >
          {t("discover")}
        </Button>
      </Flex>

      {/* Modal */}
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalOverlay bg="rgba(0,0,0,0.6)" />
        <ModalContent backgroundColor={backgroundBrown}>
          <ModalHeader
            fontFamily={displayFont}
            fontSize={{ base: "2xl", md: "3xl" }}
            color={headings}
            pt="8"
            pb="2"
          >
            {title}
          </ModalHeader>
          <ModalCloseButton size="lg" py="1.6em" px="1em" color={headings} />
          <ModalBody
            fontFamily={bodyFont}
            fontSize={{ base: "md", md: "lg" }}
            color={textColor}
            pb="8"
          >
            <Text lineHeight="1.8">{text}</Text>
            <Text
              mt="4"
              fontFamily={displayFont}
              fontSize={{ base: "lg", md: "xl" }}
              color={accent}
            >
              {price}
            </Text>

            <Box mt="6" display="flex" justifyContent="center">
              <Carousel cards={cards}></Carousel>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default RoomCard;
