import {
  Flex,
  Text,
  Icon,
  ScaleFade,
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { headings, light, textColor, accent, displayFont, bodyFont } from "../../Colors";
import parkingIcon from "@mui/icons-material/LocalParkingOutlined";
import airportShuttleIcon from "@mui/icons-material/AirportShuttleOutlined";
import breakfastIcon from "@mui/icons-material/BakeryDiningOutlined";
import wifiIcon from "@mui/icons-material/Wifi";
import airConditioningIcon from "@mui/icons-material/AcUnitOutlined";
import petFriendlyIcon from "@mui/icons-material/PetsOutlined";
import { useRef } from "react";
import { IconType } from "react-icons";
import { useInViewport } from "react-in-viewport";
import "../Fonts.css";

interface ServiceCardProps {
  icon: IconType;
  title: string;
  text: string;
}

export default function Services() {
  const { t } = useTranslation();

  const services: Array<ServiceCardProps> = [
    {
      icon: airportShuttleIcon as IconType,
      title: t("airportShuttle"),
      text: t("airportShuttleText"),
    },
    {
      icon: parkingIcon as IconType,
      title: t("parking"),
      text: t("parkingText"),
    },
    {
      icon: breakfastIcon as IconType,
      title: t("breakfast"),
      text: t("breakfastText"),
    },
    {
      icon: petFriendlyIcon as IconType,
      title: t("petFriendly"),
      text: t("petFriendlyText"),
    },
    {
      icon: wifiIcon as IconType,
      title: t("wifi"),
      text: t("wifiText"),
    },
    {
      icon: airConditioningIcon as IconType,
      title: t("airConditioning"),
      text: t("airConditioningText"),
    },
  ];

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={{ base: "12", md: "20" }}
      px="6"
      id="services"
      bg={light}
    >
      {/* Section title */}
      <Flex alignItems="center" gap="4" mb="4">
        <Box w="40px" h="1px" bg={accent} />
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontFamily={displayFont}
          color={headings}
        >
          {t("services")}
        </Text>
        <Box w="40px" h="1px" bg={accent} />
      </Flex>

      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontFamily={bodyFont}
        mb="2"
        width={{ base: "90%", md: "60%" }}
        textAlign="center"
        color={textColor}
        lineHeight="1.8"
      >
        {t("servicesText1")}
      </Text>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontFamily={bodyFont}
        mb={{ base: "8", md: "12" }}
        width={{ base: "90%", md: "60%" }}
        textAlign="center"
        color={textColor}
        lineHeight="1.8"
      >
        {t("servicesText2")}
        <br />
        {t("servicesText3")}
      </Text>

      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={{ base: "4", md: "6" }}
        maxW="1000px"
        width="100%"
      >
        {services.map((service: ServiceCardProps, index) => (
          <GridItem key={index}>
            <ServiceCard
              icon={service.icon}
              title={service.title}
              text={service.text}
            />
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
}

const ServiceCard = ({ icon, title, text }: ServiceCardProps) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(
    ref,
    { rootMargin: "-50px" },
    { disconnectOnLeave: true },
    {}
  );

  return (
    <ScaleFade initialScale={0.9} in={enterCount > 0}>
      <Flex
        ref={ref}
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        bg="white"
        borderRadius="xl"
        p={{ base: "5", md: "8" }}
        border="1px solid"
        borderColor="#E8E3D8"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "lg",
        }}
        minH={{ base: "auto", md: "220px" }}
      >
        <Icon
          fontSize={{ base: "32", md: "40" }}
          as={icon}
          color={accent}
          mb="3"
        />
        <Text
          fontFamily={displayFont}
          fontSize={{ base: "md", md: "xl" }}
          textAlign="center"
          color={headings}
          mb="2"
        >
          {title}
        </Text>
        <Text
          fontFamily={bodyFont}
          align="center"
          fontSize={{ base: "sm", md: "md" }}
          color={textColor}
          lineHeight="1.6"
        >
          {text}
        </Text>
      </Flex>
    </ScaleFade>
  );
};
