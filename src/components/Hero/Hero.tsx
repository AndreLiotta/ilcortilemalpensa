import { Box, Flex, Text, Image, Icon } from "@chakra-ui/react";
import heroImg from "../../assets/HeroImg.jpg";
import { headings, displayFont, bodyFont, textColor, accent } from "../../Colors";
import "./Hero.css";
import logoLight from "../../assets/logo-light.png";
import { useTranslation } from "react-i18next";
import "../Fonts.css";
import { FiChevronDown } from "react-icons/fi";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <>
      <Flex
        width="100%"
        minH={{ base: "70vh", md: "100vh" }}
        backgroundImage={`url(${heroImg})`}
        bgSize="cover"
        bgPosition="center"
        bgAttachment={{ base: "scroll", md: "fixed" }}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        position="relative"
      >
        {/* Dark gradient overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient={{
            base: "linear(to-b, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)",
            md: "linear(to-b, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Hero content */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
          zIndex="1"
          textAlign="center"
          px="6"
        >
          {/* Mobile: overlay card with logo + name */}
          <Flex
            display={{ base: "flex", md: "none" }}
            direction="column"
            alignItems="center"
            bg="rgba(59, 74, 43, 0.65)"
            backdropFilter="blur(8px)"
            borderRadius="2xl"
            px="10"
            py="8"
            className="hero-fade-in"
          >
            <Image
              src={logoLight}
              height="20"
              alt="Il cortile Malpensa Logo"
              mb="4"
            />
            <Text
              fontFamily={displayFont}
              color="white"
              fontSize="2xl"
              lineHeight="1.2"
              letterSpacing="0.02em"
            >
              B&B Il Cortile
            </Text>
          </Flex>

          {/* Desktop title */}
          <Text
            as="h1"
            className="hero-fade-in"
            display={{ base: "none", md: "block" }}
            fontFamily={displayFont}
            color="white"
            fontSize={{ md: "7xl", lg: "8xl" }}
            lineHeight="1.1"
            textShadow="0 2px 20px rgba(0,0,0,0.3)"
            mb="2"
          >
            B&B
            <Text
              as="span"
              className="hero-fade-in-delay"
              display="block"
              fontFamily={displayFont}
              fontSize={{ md: "7xl", lg: "8xl" }}
              lineHeight="1.1"
              textShadow="0 2px 20px rgba(0,0,0,0.3)"
            >
              Il Cortile
            </Text>
          </Text>
        </Flex>

        {/* Scroll indicator */}
        <Box
          position="absolute"
          bottom="6"
          className="scroll-indicator"
          zIndex="1"
        >
          <Icon as={FiChevronDown} w={7} h={7} color="white" opacity={0.7} />
        </Box>
      </Flex>

      {/* Intro text below hero */}
      <Flex
        direction="column"
        alignItems="center"
        bg="#FAF7F2"
        py={{ base: "12", md: "20" }}
        px="6"
      >
        <Box maxW="800px" textAlign="center" className="hero-fade-in">
          <Text
            fontFamily={displayFont}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontStyle="italic"
            color={headings}
            mb="1"
            lineHeight="1.2"
          >
            &ldquo;
          </Text>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            fontFamily={bodyFont}
            fontWeight="400"
            lineHeight="1.8"
            color={textColor}
            mb="6"
          >
            {t("intro")}
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontFamily={displayFont}
            fontStyle="italic"
            color={accent}
            lineHeight="1.6"
          >
            {t("borges")}
          </Text>
        </Box>
      </Flex>
    </>
  );
}
