import {
  Flex,
  Icon,
  Text,
  Link,
  Box,
} from "@chakra-ui/react";
import "../Fonts.css";
import { backgroundBrown, headings, light, navBackground } from "../../Colors";
import mailIcon from "@mui/icons-material/MailOutline";
import phoneIcon from "@mui/icons-material/PhoneOutlined";
import whereIcon from "@mui/icons-material/PinDropOutlined";
import privacyIcon from "@mui/icons-material/PrivacyTipOutlined";
import codeIcon from "@mui/icons-material/Code";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import privacyPolicy from "../../assets/privacyPolicy.pdf";

export default function Footer() {
  const { t, i18n } = useTranslation();

  function openPdf() {
    window.open(privacyPolicy);
  }

  return (
    <Flex
      w="full"
      borderTop="3px solid"
      borderColor={headings}
      justifyContent="center"
    >
      <Flex w="90%" flexDirection={{base: "column", md: "row"}} justifyContent="space-between" my={{base: "1em", md: "10"}}>
        <Box flexDirection="column">
          <Text mb="1.5" fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" color={headings}>
            B&B Il Cortile
          </Text>
          <Flex direction="row" alignItems="center">
            <Icon
              as={whereIcon}
              w={{ base: 4, md: 6 }}
              h={{ base: 4, md: 6 }}
              color={headings}
              mr="1"
            ></Icon>
            <Link href="https://goo.gl/maps/ybBDCuyTGoUn93GW6" color={headings}>
              Via Torino 57 <br /> Casorate Sempione(VA), 21011
            </Link>
          </Flex>
        </Box>
        <Box flexDirection="column">
          <Text mb="1.5" fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" color={headings}>
            Contatti
          </Text>
          <Flex direction="row" alignItems="center" mb="1.5">
            <Icon
              as={mailIcon}
              w={{ base: 4, md: 6 }}
              h={{ base: 4, md: 6 }}
              color={headings}
              mr="1"
            ></Icon>
            <Link href="mailto:ilcortile@hotmail.it" color={headings}>ilcortile@hotmail.it</Link>
          </Flex>
          <Flex direction="row" alignItems="center">
            <Icon
              as={phoneIcon}
              w={{ base: 4, md: 6 }}
              h={{ base: 4, md: 6 }}
              color={headings}
              mr="1"
            ></Icon>
            <Link href="tel:00393471106528" color={headings}>+39 3471106528</Link>
          </Flex>
        </Box>
        <Box flexDirection="column">
          <Text mb="1.5" fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" color={headings}>
            Altro
          </Text>
          <Flex direction="row" alignItems="center" mb="1.5">
            <Icon
              as={privacyIcon}
              w={{ base: 4, md: 6 }}
              h={{ base: 4, md: 6 }}
              color={headings}
              mr="1"
            ></Icon>
            <Link onClick={() => openPdf()} color={headings}>Privacy Policy</Link>
          </Flex>

          <Flex direction="row" alignItems="center">
            <Icon
              as={codeIcon}
              w={{ base: 4, md: 6 }}
              h={{ base: 4, md: 6 }}
              color={headings}
              mr="1"
            ></Icon>
            <Text color={headings}>Sito realizzato da: Andrea Liotta</Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}