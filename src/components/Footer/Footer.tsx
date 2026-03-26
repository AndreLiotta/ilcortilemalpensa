import React from "react";
import { Flex, Icon, Text, Link, Box } from "@chakra-ui/react";
import "../Fonts.css";
import { headings, light, accent, displayFont, bodyFont } from "../../Colors";
import { FiMail, FiPhone, FiMapPin, FiShield, FiCode } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import privacyPolicy from "../../assets/privacyPolicy.pdf";
import privacyPolicyEn from "../../assets/privacyPolicyen.pdf";

const MailIcon = FiMail as React.ElementType;
const PhoneIcon = FiPhone as React.ElementType;
const MapPinIcon = FiMapPin as React.ElementType;
const ShieldIcon = FiShield as React.ElementType;
const CodeIcon = FiCode as React.ElementType;

export default function Footer() {
  const { t, i18n } = useTranslation();

  function openPdf() {
    if (i18n.language === "it") {
      window.open(privacyPolicy, "_blank", "noopener,noreferrer");
    } else if (i18n.language === "en") {
      window.open(privacyPolicyEn, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Flex
      w="full"
      bg={headings}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      py={{ base: "8", md: "14" }}
    >
      <Flex
        w={{ base: "90%", md: "85%" }}
        maxW="1200px"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-between"
        gap={{ base: "8", md: "4" }}
        mb={{ base: "6", md: "10" }}
      >
        {/* Column 1: Address */}
        <Box w="full" textAlign="center">
          <Text
            mb="4"
            fontSize={{ base: "lg", md: "xl" }}
            fontFamily={displayFont}
            color={light}
          >
            B&B Il Cortile
          </Text>
          <Flex direction="row" alignItems="center" justifyContent="center">
            <Icon
              as={MapPinIcon}
              w={{ base: 4, md: 5 }}
              h={{ base: 4, md: 5 }}
              color={accent}
              mr="2"
            />
            <Link
              href="https://goo.gl/maps/ybBDCuyTGoUn93GW6"
              color={light}
              fontFamily={bodyFont}
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.85"
              _hover={{ opacity: 1, textDecoration: "underline" }}
              transition="opacity 0.3s"
            >
              Via Torino 63 Casorate Sempione(VA), 21011
            </Link>
          </Flex>
        </Box>

        {/* Column 2: Contacts */}
        <Box w="full" textAlign="center">
          <Text
            mb="4"
            fontSize={{ base: "lg", md: "xl" }}
            fontFamily={displayFont}
            color={light}
          >
            {t("contacts")}
          </Text>
          <Flex
            direction="row"
            alignItems="center"
            mb="3"
            justifyContent="center"
          >
            <Icon
              as={MailIcon}
              w={{ base: 4, md: 5 }}
              h={{ base: 4, md: 5 }}
              color={accent}
              mr="2"
            />
            <Link
              href="mailto:ilcortile@hotmail.it"
              color={light}
              fontFamily={bodyFont}
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.85"
              _hover={{ opacity: 1, textDecoration: "underline" }}
              transition="opacity 0.3s"
            >
              ilcortile@hotmail.it
            </Link>
          </Flex>
          <Flex direction="row" alignItems="center" justifyContent="center">
            <Icon
              as={PhoneIcon}
              w={{ base: 4, md: 5 }}
              h={{ base: 4, md: 5 }}
              color={accent}
              mr="2"
            />
            <Link
              href="tel:00393471106528"
              color={light}
              fontFamily={bodyFont}
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.85"
              _hover={{ opacity: 1, textDecoration: "underline" }}
              transition="opacity 0.3s"
            >
              +39 3471106528
            </Link>
          </Flex>
        </Box>

        {/* Column 3: Other */}
        <Box w="full" textAlign="center">
          <Text
            mb="4"
            fontSize={{ base: "lg", md: "xl" }}
            fontFamily={displayFont}
            color={light}
          >
            {t("other")}
          </Text>
          <Flex
            direction="row"
            alignItems="center"
            mb="3"
            justifyContent="center"
          >
            <Icon
              as={ShieldIcon}
              w={{ base: 4, md: 5 }}
              h={{ base: 4, md: 5 }}
              color={accent}
              mr="2"
            />
            <Link
              onClick={() => openPdf()}
              color={light}
              fontFamily={bodyFont}
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.85"
              _hover={{ opacity: 1, textDecoration: "underline", cursor: "pointer" }}
              transition="opacity 0.3s"
            >
              Privacy Policy
            </Link>
          </Flex>
          <Flex direction="row" alignItems="center" justifyContent="center">
            <Icon
              as={CodeIcon}
              w={{ base: 4, md: 5 }}
              h={{ base: 4, md: 5 }}
              color={accent}
              mr="2"
            />
            <Text
              color={light}
              fontFamily={bodyFont}
              fontSize={{ base: "sm", md: "md" }}
              opacity="0.85"
            >
              {t("madeBy")}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* Legal codes */}
      <Box borderTop="1px solid" borderColor="rgba(240,236,227,0.2)" pt="4" w={{ base: "90%", md: "85%" }} maxW="1200px">
        <Flex
          alignItems="center"
          justifyContent="center"
          w="full"
          flexDirection="column"
          gap="1"
        >
          <Text color={light} fontFamily={bodyFont} fontSize="xs" opacity="0.5">
            {t("RC")}
          </Text>
          <Text color={light} fontFamily={bodyFont} fontSize="xs" opacity="0.5">
            {t("CIN")}
          </Text>
          <Text color={light} fontFamily={bodyFont} fontSize="xs" opacity="0.5">
            {t("SC")}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
