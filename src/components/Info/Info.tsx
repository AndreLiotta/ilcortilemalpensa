import {
  Flex,
  Text,
  Icon,
  Box,
  Button,
} from "@chakra-ui/react";
import { headings, textColor, accent, light, displayFont, bodyFont } from "../../Colors";
import { useTranslation } from "react-i18next";
import whatsappIcon from "@mui/icons-material/WhatsApp";
import mailIcon from "@mui/icons-material/MailOutline";
import phoneIcon from "@mui/icons-material/PhoneOutlined";
import "../Fonts.css";
import { IconType } from "react-icons";

export default function Info() {
  const { t } = useTranslation();

  function infoButtonAction(action: string) {
    if (action === "email") {
      window.open("mailto:ilcortile@hotmail.it", "_blank", "noopener,noreferrer");
    } else if (action === "phone") {
      window.open("tel:00393471106528", "_blank", "noopener,noreferrer");
    } else if (action === "whatsapp") {
      window.open("https://api.whatsapp.com/send?phone=393471106528", "_blank", "noopener,noreferrer");
    }
  }

  const contactButtons = [
    { action: "email", icon: mailIcon, label: "Email" },
    { action: "phone", icon: phoneIcon, label: t("call") },
    { action: "whatsapp", icon: whatsappIcon, label: "WhatsApp" },
  ];

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      py={{ base: "12", md: "20" }}
      px="6"
      id="info"
      bg={light}
    >
      <Flex alignItems="center" gap="4" mb="4">
        <Box w="40px" h="1px" bg={accent} />
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontFamily={displayFont}
          color={headings}
        >
          {t("info")}
        </Text>
        <Box w="40px" h="1px" bg={accent} />
      </Flex>

      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontFamily={bodyFont}
        mb={{ base: "8", md: "10" }}
        width={{ base: "90%", md: "60%" }}
        textAlign="center"
        color={textColor}
        lineHeight="1.8"
      >
        {t("infoText")}
      </Text>

      {/* Pill-shaped contact buttons */}
      <Flex
        gap={{ base: "3", md: "6" }}
        flexWrap="wrap"
        justifyContent="center"
      >
        {contactButtons.map((btn) => (
          <Button
            key={btn.action}
            variant="outline"
            leftIcon={
              <Icon
                as={btn.icon as IconType}
                w={{ base: 5, md: 6 }}
                h={{ base: 5, md: 6 }}
              />
            }
            px={{ base: "5", md: "8" }}
            py={{ base: "6", md: "7" }}
            borderRadius="full"
            border="2px solid"
            borderColor={headings}
            color={headings}
            bg="transparent"
            fontFamily={bodyFont}
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            onClick={() => infoButtonAction(btn.action)}
            transition="all 0.3s ease"
            _hover={{
              bg: headings,
              color: "white",
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}
