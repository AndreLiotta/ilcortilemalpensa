import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { backgroundBrown, headings, light, navBackground } from "../../Colors";
import { useTranslation } from "react-i18next";
import "./Where.css";
import map from "../../assets/mapimage.jpg";

export default function Where() {
  const { t, i18n } = useTranslation();

  function openInMaps() {
    window.open("https://goo.gl/maps/ybBDCuyTGoUn93GW6");
  }

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      pb={{ base: "8", md: "12" }}
      id="where"
    >
      <Text
        fontSize={{ base: "3xl", md: "4xl" }}
        fontFamily="Cormorant"
        fontWeight="bold"
        pb="0.5em"
        color={headings}
      >
        {t("where")}
      </Text>
      <Text
        fontSize={{ base: "md", md: "xl" }}
        fontFamily="Cormorant"
        pb="0.7em"
        width={{ base: "90%", md: "80%" }}
        fontWeight="semibold"
        textAlign="center"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
        reprehenderit laudantium error, molestiae asperiores amet tempora, sunt
        animi et incidunt in dolore qui fugiat, obcaecati nobis est ipsa
        exercitationem facere?
      </Text>
      <Flex width={{ base: "100%", md: "60%" }} height="auto">
        <Image src={map} borderRadius={{ base: "0", md: "30" }}></Image>
      </Flex>
      <Button
        onClick={() => openInMaps()}
        mt="1.5"
        size={{ base: "sm", md: "md" }}
        backgroundColor={headings}
        color={light}
        id="mapsButton"
      >
        Apri in google maps
      </Button>
    </Flex>
  );
}