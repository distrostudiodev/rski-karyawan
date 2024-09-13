import {
  Button,
  HStack,
  Icon,
  StackProps,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiCalendarLine } from "@remixicon/react";
import { useState } from "react";
import { useLightDarkColor } from "../../constant/colors";
import useRenderTrigger from "../../global/useRenderTrigger";
import backOnClose from "../../lib/backOnClose";
import formatDate from "../../lib/formatDate";
import req from "../../lib/req";
import timeSince from "../../lib/timeSince";
import CContainer from "../independent/wrapper/CContainer";
import CustomDrawer from "../independent/wrapper/CustomDrawer";
import DisclosureHeader from "./DisclosureHeader";
import DrawerHeader from "./DrawerHeader";
import Img from "./Img";

const KonfirmasiBergabung = ({ data }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const { rt, setRt } = useRenderTrigger();

  function joinDiklat() {
    const payload = {
      diklat_id: data.id,
    };
    req
      .post(`/api/join-diklat`, payload)
      .then((r) => {
        if (r.status === 200) {
          setRt(!rt);
          backOnClose();
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          status: "error",
          title:
            (typeof e?.response?.data?.message === "string" &&
              (e?.response?.data?.message as string)) ||
            "Maaf terjadi kesalahan pada sistem",
          position: "bottom-right",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Button w={"100%"} className="btn-ap clicky" colorScheme="ap">
        Bergabung
      </Button>

      <CustomDrawer
        id="konfirmasi-bergabung-diklat"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        header={<DisclosureHeader title="Konfirmasi Bergabung" />}
        footer={
          <>
            <Button
              className="btn-solid clicky"
              onClick={backOnClose}
              isDisabled={loading}
            >
              Tidak
            </Button>
            <Button
              className="btn-ap clicky"
              colorScheme="ap"
              onClick={joinDiklat}
              isLoading={loading}
            >
              Ya
            </Button>
          </>
        }
      >
        <Text>
          Apakah anda yakin akan bergabung dalam Diklat ini? <b>{data?.nama}</b>
        </Text>
      </CustomDrawer>
    </>
  );
};

interface Props extends StackProps {
  data: any;
}

export default function EventDiklatItem({ data, ...props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // SX
  const lightDarkColor = useLightDarkColor();

  // console.log(data?.path);

  return (
    <>
      <CContainer
        flex={0}
        borderRadius={12}
        overflow={"clip"}
        bg={lightDarkColor}
        cursor={"pointer"}
        className={"clicky"}
        onClick={onOpen}
        {...props}
      >
        <Img
          src={data?.path || "/vectors/noImage.svg"}
          fallbackSrc="/vectors/noImage.svg"
        />
        <CContainer p={4} gap={2}>
          <HStack justify={"space-between"}>
            <Text fontSize={12} opacity={0.4}>
              {timeSince(data.created_at)}
            </Text>

            <Text fontSize={12} opacity={0.4}>
              Kuota : {data.kuota}
            </Text>
          </HStack>

          <Text fontWeight={600} noOfLines={2}>
            {data.nama}
          </Text>

          <HStack opacity={0.4}>
            <Icon as={RiCalendarLine} />
            <Text>{formatDate(data.created_at)}</Text>
          </HStack>
        </CContainer>
      </CContainer>

      <CustomDrawer
        id={`diklat-event-diklat-${data.id}`}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        header={<DrawerHeader title="Detail Event/Diklat" />}
        footer={
          <>
            <KonfirmasiBergabung data={data} />
          </>
        }
      >
        <Img
          src={data?.path || "/vectors/noImage.svg"}
          fallbackSrc="/vectors/noImage.svg"
        />
        <CContainer px={6} gap={2}>
          <HStack justify={"space-between"}>
            <Text color={"p.500"} fontSize={12} fontWeight={500}>
              {data.jenis}
            </Text>

            <Text fontSize={12} opacity={0.4}>
              {timeSince(data.created_at)}
            </Text>
          </HStack>

          <Text fontWeight={600} noOfLines={2}>
            {data.nama}
          </Text>

          <HStack opacity={0.4} mb={4}>
            <Icon as={RiCalendarLine} />
            <Text>{formatDate(data.created_at)}</Text>
          </HStack>

          <Text>isi event/diklat</Text>

          <Text fontWeight={500}>Peserta</Text>
        </CContainer>
      </CustomDrawer>
    </>
  );
}
