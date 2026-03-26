import { Link } from "@chakra-ui/react";
import { bodyFont } from "../../Colors";

export default function SkipToContent() {
  return (
    <Link
      href="#rooms"
      position="absolute"
      top="-100px"
      left="4"
      zIndex="9999"
      bg="white"
      color="black"
      px="4"
      py="2"
      borderRadius="md"
      fontFamily={bodyFont}
      fontWeight="600"
      _focus={{
        top: "4",
      }}
    >
      Skip to content
    </Link>
  );
}
