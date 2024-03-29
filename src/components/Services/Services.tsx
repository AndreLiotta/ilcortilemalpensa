import {
  Flex,
  Text,
  Icon,
  ScaleFade,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { headings, light } from "../../Colors";
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
  const { t, i18n } = useTranslation();

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
      pb={{ base: "8", md: "12" }}
      id="services"
      mb="2.5em"
    >
      <Text
        fontSize={{ base: "3xl", md: "4xl" }}
        fontFamily="Cormorant"
        fontWeight="bold"
        pb="0.5em"
        color={headings}
      >
        {t("services")}
      </Text>
      <Text
        fontSize={{ base: "md", md: "xl" }}
        pb="0.7em"
        width={{ base: "90%", md: "80%" }}
        textAlign="center"
        color={headings}
      >
        {t("servicesText1")}
      </Text>
      <Text
        fontSize={{ base: "md", md: "xl" }}
        pb="1.5em"
        width={{ base: "90%", md: "80%" }}
        textAlign="center"
        color={headings}
      >
        {t("servicesText2")}
        <br />
        {t("servicesText3")}
      </Text>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
        {services.map((service: ServiceCardProps, index) => (
          <GridItem pb="1.5em" key={index}>
            <ServiceCard
              icon={service.icon}
              title={service.title}
              text={service.text}
            ></ServiceCard>
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
    <ScaleFade
      initialScale={0.9}
      in={enterCount > 0}
    >
      <Flex
        flexDirection="column"
        ref={ref}
        alignItems="center"
        justifyContent="center"
        color={headings}
      >
        <Icon
          fontSize={{ base: "32", md: "48" }}
          _groupHover={{
            color: light,
          }}
          as={icon}
          color={headings}
        />
        <Text
          fontFamily="Cormorant"
          fontWeight="bold"
          fontStyle="italic"
          fontSize={{ base: "lg", md: "2xl" }}
          maxWidth="7.5em"
          textAlign="center"
        >
          {title}
        </Text>
        <Text
          align="center"
          fontSize={{ base: "sm", md: "lg" }}
          w={{ base: "60%", md: "40%" }}
        >
          {text}
        </Text>
      </Flex>
    </ScaleFade>
  );
};
