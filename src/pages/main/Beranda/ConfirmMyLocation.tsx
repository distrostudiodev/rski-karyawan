import {
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import AlertOutsidePresenceRadius from "../../../components/dependent/AlertOutsidePresenceRadius";
import LeafletMap from "../../../components/dependent/LeafletMap";
import ComponentSpinner from "../../../components/independent/ComponentSpinner";
import CContainer from "../../../components/independent/wrapper/CContainer";
import { useLightDarkColor } from "../../../constant/colors";
import { Interface__AttendanceData } from "../../../constant/interfaces";
import useBackOnClose from "../../../hooks/useBackOnClose";
import backOnClose from "../../../lib/backOnClose";
import getCurrentAddress from "../../../lib/getCurrentAddress";
import getLocation from "../../../lib/getLocation";
import isWithinRadius from "../../../lib/isWithinRadius";
import AmbilFoto from "./AmbilFoto";
import { RiMapPin2Line } from "@remixicon/react";
import req from "../../../lib/req";
import reload from "../../../lib/reload";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: any;
  attendanceData: Interface__AttendanceData;
}
export default function ConfirmMyLocation({
  isOpen,
  onOpen,
  onClose,
  data,
  attendanceData,
}: Props) {
  useBackOnClose("confirm-my-location-full-modal", isOpen, onOpen, onClose);

  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [outsideRadius, setOutsideRadius] = useState<boolean>(false);
  const [alertOutsideRadius, setAlertOutsideRadius] = useState<boolean>(false);

  const [myLocation, setMyLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [officeLocation, setOfficeLocation] = useState<any>(undefined);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);

      req
        .get(`/api/get-office-location`)
        .then((r) => {
          if (r.status === 200) {
            const officeLocationData = r.data.data;
            setOfficeLocation(officeLocationData);
            getLocation()
              .then((myLocation) => {
                setMyLocation(myLocation);
                getCurrentAddress(myLocation.lat, myLocation.long)
                  .then((address) => {
                    setAddress(address);
                    if (
                      myLocation &&
                      data &&
                      isWithinRadius(
                        myLocation.lat,
                        myLocation.long,
                        parseFloat(officeLocationData?.lat),
                        parseFloat(officeLocationData?.long),
                        officeLocationData?.radius
                      )
                    ) {
                    } else {
                      if (myLocation) {
                        setOutsideRadius(true);
                        setAlertOutsideRadius(true);
                      }
                    }
                  })
                  .catch((error) => {
                    setAddress("Error, silahkan reload");
                    console.error(error);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              })
              .catch((error) => {
                console.error("Gagal mendapatkan lokasi:", error);
                setLoading(false);
              });
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title:
              (typeof e?.response?.data?.message === "string" &&
                (e?.response?.data?.message as string)) ||
              "Terjadi kendala, silahkan periksa jaringan atau hubungi SIM RS",
            position: "top",
            isClosable: true,
          });
          setLoading(false);
        });
    }
  }, [isOpen, data, toast]);

  // SX
  const bodyColor = useLightDarkColor();

  return (
    <>
      <AlertOutsidePresenceRadius
        isOpen={alertOutsideRadius}
        onOpen={() => {
          setAlertOutsideRadius(true);
        }}
        onClose={() => {
          setAlertOutsideRadius(false);
        }}
      />

      <Modal isOpen={isOpen} onClose={backOnClose} size={"full"}>
        <ModalContent m={0} border={"none"}>
          <ModalBody>
            <CContainer flex={1}>
              {loading && (
                <VStack
                  p={5}
                  h={"100vh"}
                  justify={"center"}
                  flex={1}
                  position={"relative"}
                >
                  <ComponentSpinner
                    position={"absolute"}
                    spinnerProps={{ size: "xl", w: "80px", h: "80px" }}
                    opacity={0.4}
                  />

                  <Icon as={RiMapPin2Line} fontSize={32} opacity={0.4} />
                </VStack>
              )}

              {!loading && officeLocation && !myLocation && (
                <VStack justify={"center"} p={6} flex={1}>
                  <Text mb={4}>Error, silahkan kembali dan coba lagi</Text>
                  <Button
                    className="btn-solid clicky"
                    w={"50%"}
                    onClick={() => {
                      window.history.back();
                    }}
                  >
                    Kembali
                  </Button>
                </VStack>
              )}

              {!loading && myLocation && attendanceData && address && (
                <>
                  <LeafletMap
                    center={{
                      lat: myLocation.lat,
                      lng: myLocation.long,
                    }}
                    officeCenter={{
                      lat: officeLocation?.lat || -7.5626538,
                      lng: officeLocation?.long || 110.8018715,
                    }}
                    zoom={20}
                    presence_radius={officeLocation?.radius || 100}
                  />

                  <VStack
                    align={"stretch"}
                    w={"100%"}
                    position={"fixed"}
                    bottom={0}
                    left={0}
                    p={4}
                  >
                    <VStack
                      align={"stretch"}
                      bg={bodyColor}
                      p={6}
                      borderRadius={16}
                      w={"100%"}
                      maxW={"656px"}
                      mx={"auto"}
                    >
                      <HStack justify={"space-between"} opacity={0.4} mb={2}>
                        <Text fontSize={[12, null, 16]}>Konfirmasi Alamat</Text>
                        <Text fontSize={[12, null, 16]}>
                          Akurat hingga 1.5 km
                        </Text>
                      </HStack>

                      <Text mb={4}>{address}</Text>

                      <ButtonGroup>
                        <Button
                          className="btn-solid clicky"
                          w={"50%"}
                          onClick={() => {
                            window.history.back();
                          }}
                        >
                          Kembali
                        </Button>

                        <Button
                          w={"50%"}
                          className="btn-solid clicky"
                          onClick={reload}
                        >
                          Muat Ulang
                        </Button>
                      </ButtonGroup>

                      <AmbilFoto
                        attendanceData={attendanceData}
                        isDisabled={outsideRadius}
                      />
                    </VStack>
                  </VStack>
                </>
              )}
            </CContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
