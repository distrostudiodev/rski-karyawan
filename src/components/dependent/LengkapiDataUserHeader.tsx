import { HStack, StackProps } from "@chakra-ui/react";
import { useLightDarkColor } from "../../constant/colors";
import BantuanButton from "../independent/BantuanButton";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";

interface Props extends StackProps {
  backLink?: string;
}

export default function LengkapiDataUserHeader({ backLink, ...props }: Props) {
  // SX
  const lightDarkColor = useLightDarkColor();
  return (
    <HStack
      // px={4}
      bg={lightDarkColor}
      py={5}
      justify={"space-between"}
      position={"sticky"}
      top={0}
      left={0}
      w={"100%"}
      zIndex={99}
      {...props}
    >
      {/* <BackButton backLink={backLink} /> */}
      <ColorModeSwitcher
        colorScheme="ap"
        variant={"ghost"}
        color={"p.500"}
        mr={"auto"}
        ml={0}
      />

      <BantuanButton ml={"0"} />
    </HStack>
  );
}
