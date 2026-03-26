import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  IconButton,
  CloseButton,
  Flex,
  Link,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Text,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  light,
  navBackground,
  displayFont,
  accent,
} from "../../Colors";
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import logoLight from "../../assets/logo-light.png";
import enFlag from "../../assets/us.svg";
import itFlag from "../../assets/it.svg";
import "../Fonts.css";

interface LinkItemProps {
  name: string;
  link: string;
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const onClickLanguageChange = (newLang: string) => {
    const currentPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(currentPath);
  };

  const linkItems: Array<LinkItemProps> = [
    { name: "rooms", link: `/${lang}/#rooms` },
    { name: "services", link: `/${lang}/#services` },
    { name: "where", link: `/${lang}/#where` },
    { name: "info", link: `/${lang}/#info` },
    { name: "gallery", link: `/${lang}/gallery` },
  ];

  return (
    <>
      {/* Desktop top navbar */}
      <Flex
        as="nav"
        display={{ base: "none", md: "flex" }}
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
        alignItems="center"
        justifyContent="space-between"
        px="8"
        py={scrolled ? "3" : "5"}
        bg={scrolled ? navBackground : "rgba(59, 74, 43, 0.5)"}
        backdropFilter={scrolled ? "none" : "blur(10px)"}
        boxShadow={scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "0 1px 8px rgba(0,0,0,0.08)"}
        transition="all 0.4s ease"
      >
        {/* Logo */}
        <Flex
          alignItems="center"
          cursor="pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image
            src={logoLight}
            height="12"
            alt="Il cortile Malpensa Logo"
          />
        </Flex>

        {/* Nav links */}
        <Flex gap="8" alignItems="center">
          {linkItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="nav-link"
              fontFamily={displayFont}
              fontSize="lg"
              color={scrolled ? light : "white"}
              textDecoration="none"
              position="relative"
              _hover={{ textDecoration: "none" }}
              textShadow={scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.5)"}
              transition="color 0.3s ease"
            >
              {t(item.name)}
            </Link>
          ))}
        </Flex>

        {/* Language switcher */}
        <Flex gap="3" alignItems="center">
          <Box
            as="button"
            aria-label="Italiano"
            onClick={() => onClickLanguageChange("it")}
            bg="transparent"
            border="none"
            cursor="pointer"
            p="0"
            lineHeight="0"
          >
            <Image
              src={itFlag}
              alt=""
              h="24px"
              opacity={lang === "it" ? 1 : 0.6}
              _hover={{ opacity: 1 }}
              transition="opacity 0.3s"
            />
          </Box>
          <Box
            as="button"
            aria-label="English"
            onClick={() => onClickLanguageChange("en")}
            bg="transparent"
            border="none"
            cursor="pointer"
            p="0"
            lineHeight="0"
          >
            <Image
              src={enFlag}
              alt=""
              h="24px"
              opacity={lang === "en" ? 1 : 0.6}
              _hover={{ opacity: 1 }}
              transition="opacity 0.3s"
            />
          </Box>
        </Flex>
      </Flex>

      {/* Mobile top bar */}
      <MobileNav onOpen={onOpen} scrolled={scrolled} />

      {/* Mobile drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay bg="rgba(0,0,0,0.4)" />
        <DrawerContent bg={navBackground}>
          <Flex direction="column" h="full">
            {/* Top: close button */}
            <Flex h="14" alignItems="center" justifyContent="flex-end" px="6" flexShrink={0}>
              <CloseButton onClick={onClose} size="lg" color={light} />
            </Flex>

            {/* Center: logo + nav links */}
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              flex="1"
              gap="5"
              pt="6"
            >
              <Image src={logo} height="20" alt="Il cortile Malpensa Logo" mb="6" />
              {linkItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={onClose}
                  fontFamily={displayFont}
                  fontSize="2xl"
                  color={light}
                  textDecoration="none"
                  _hover={{ color: accent }}
                  transition="color 0.3s"
                >
                  {t(item.name)}
                </Link>
              ))}
            </Flex>

            {/* Bottom: language flags */}
            <Flex justifyContent="center" gap="5" pb="10" flexShrink={0}>
              <Box
                as="button"
                aria-label="Italiano"
                onClick={() => { onClickLanguageChange("it"); onClose(); }}
                bg="transparent"
                border="none"
                cursor="pointer"
                p="0"
                lineHeight="0"
              >
                <Image src={itFlag} alt="" h="32px" opacity={lang === "it" ? 1 : 0.6} _hover={{ opacity: 1 }} />
              </Box>
              <Box
                as="button"
                aria-label="English"
                onClick={() => { onClickLanguageChange("en"); onClose(); }}
                bg="transparent"
                border="none"
                cursor="pointer"
                p="0"
                lineHeight="0"
              >
                <Image src={enFlag} alt="" h="32px" opacity={lang === "en" ? 1 : 0.6} _hover={{ opacity: 1 }} />
              </Box>
            </Flex>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface MobileNavProps {
  onOpen: () => void;
  scrolled: boolean;
}

const MobileNav = ({ onOpen, scrolled }: MobileNavProps) => {
  const [visible, setVisible] = useState(true);
  const yOffsetRef = useRef(window.pageYOffset);

  useEffect(() => {
    function handleScroll() {
      const currentYOffset = window.pageYOffset;
      setVisible(yOffsetRef.current > currentYOffset || currentYOffset < 80);
      yOffsetRef.current = currentYOffset;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999"
      alignItems="center"
      justifyContent="space-between"
      px="4"
      height="14"
      bg="rgba(59, 74, 43, 0.7)"
      backdropFilter="blur(12px)"
      boxShadow="0 1px 12px rgba(0,0,0,0.1)"
      transition="all 0.4s ease"
      transform={visible ? "translateY(0)" : "translateY(-100%)"}
    >
      <Text
        fontSize="xl"
        fontFamily={displayFont}
        color={light}
        cursor="pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Il cortile B&B
      </Text>
      <IconButton
        variant="ghost"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu size={28} color={light} />}
        _hover={{ bg: "transparent" }}
      />
    </Flex>
  );
};
