import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Navbar from "./components/SideBar/SideBar";
import Hero from "./components/Hero/Hero";
import Rooms from "./components/Rooms/Rooms";
import Services from "./components/Services/Services";
import Where from "./components/Where/Where";
import Info from "./components/Info/Info";
import Footer from "./components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./components/Gallery/Gallery";

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Rooms />
      <Services />
      <Where />
      <Info />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ChakraProvider theme={theme}>
              <HomePage />
            </ChakraProvider>
          }
        />
        <Route
          path="/gallery"
          element={
            <ChakraProvider theme={theme}>
              <Gallery />
            </ChakraProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
