import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { backgroundBrown, headings, accent, accentHover, displayFont, bodyFont, textColor } from "../../Colors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex
          minH="100vh"
          bg={backgroundBrown}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          px="6"
          textAlign="center"
        >
          <Text
            fontFamily={displayFont}
            fontSize={{ base: "2xl", md: "4xl" }}
            color={headings}
            mb="4"
          >
            Something went wrong
          </Text>
          <Text
            fontFamily={bodyFont}
            fontSize={{ base: "md", md: "lg" }}
            color={textColor}
            mb="8"
          >
            We're sorry for the inconvenience. Please try reloading the page.
          </Text>
          <Button
            onClick={() => window.location.reload()}
            bg={accent}
            color="white"
            fontFamily={displayFont}
            borderRadius="full"
            px="8"
            size="lg"
            _hover={{ bg: accentHover }}
          >
            Reload page
          </Button>
        </Flex>
      );
    }

    return this.props.children;
  }
}
