import { Image, Text } from "@chakra-ui/react";
import Header from "../../../components/dependent/Header";
import CContainer from "../../../components/independent/wrapper/CContainer";
import { useContentBgColor } from "../../../constant/colors";

export default function Koperasi() {
  // SX
  const contentBgColor = useContentBgColor();

  return (
    <CContainer flex={1}>
      <Header left={"back"} title="Koperasi" px={4} />

      <CContainer
        flex={1}
        p={5}
        bg={contentBgColor}
        align={"center"}
        justify={"center"}
      >
        <Image src="/vectors/error503.webp" maxW={"300px"} mb={6} />
        <Text fontSize={16} fontWeight={600}>
          Maaf, fitur ini belum tersedia
        </Text>
      </CContainer>
    </CContainer>
  );
}
