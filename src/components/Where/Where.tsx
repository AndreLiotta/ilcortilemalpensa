import { Flex, Text, Image, Button, Box } from "@chakra-ui/react";
import { headings, textColor, accent, displayFont, bodyFont } from "../../Colors";
import { useTranslation } from "react-i18next";
import map from "../../assets/mapimage.png";
import mapMobile from "../../assets/mapimage-mobile.png";
import "../Fonts.css";

export default function Where() {
  const { t } = useTranslation();

  function openInMaps() {
    window.open("https://goo.gl/maps/ybBDCuyTGoUn93GW6");
  }

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={{ base: "12", md: "20" }}
      px="6"
      id="where"
      bg="#FAF7F2"
    >
      {/* Section title */}
      <Flex alignItems="center" gap="4" mb="4">
        <Box w="40px" h="1px" bg={accent} />
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontFamily={displayFont}
          color={headings}
        >
          {t("where")}
        </Text>
        <Box w="40px" h="1px" bg={accent} />
      </Flex>

      {/* Asymmetric layout on desktop */}
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="1200px"
        width="100%"
        gap={{ base: "6", md: "12" }}
        alignItems="center"
        mt={{ base: "4", md: "8" }}
      >
        {/* Text side */}
        <Flex
          direction="column"
          flex="1"
          alignItems={{ base: "center", md: "flex-start" }}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontFamily={bodyFont}
            color={textColor}
            lineHeight="1.8"
            textAlign={{ base: "center", md: "left" }}
            mb="4"
          >
            {t("whereText0")} <br />
            {t("whereText1")}
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontFamily={bodyFont}
            color={textColor}
            lineHeight="1.8"
            textAlign={{ base: "center", md: "left" }}
            mb="4"
          >
            {t("whereText3")}
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontFamily={bodyFont}
            color={textColor}
            lineHeight="1.8"
            textAlign={{ base: "center", md: "left" }}
            mb="6"
          >
            {t("whereText4")}
          </Text>
          <Button
            onClick={() => openInMaps()}
            size={{ base: "md", md: "lg" }}
            bg={accent}
            color="white"
            fontFamily={displayFont}
            fontSize={{ base: "md", md: "lg" }}
            borderRadius="full"
            px="8"
            _hover={{ bg: "#b5633f" }}
            transition="all 0.3s ease"
          >
            {t("openInMaps")}
          </Button>
        </Flex>

        {/* Map side */}
        <Box flex="1.2">
          <Image
            src={map}
            alt="Mappa della posizione di B&B Il Cortile a Casorate Sempione, vicino all'aeroporto di Malpensa"
            borderRadius="xl"
            shadow="xl"
            display={{ base: "none", md: "block" }}
            w="100%"
          />
          <Image
            src={mapMobile}
            alt="Mappa della posizione di B&B Il Cortile a Casorate Sempione"
            borderRadius="xl"
            shadow="xl"
            display={{ base: "block", md: "none" }}
            w="100%"
          />
        </Box>
      </Flex>
    </Flex>
  );
}
