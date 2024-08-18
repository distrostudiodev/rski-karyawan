import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  RiDeleteBinLine,
  RiDownload2Line,
  RiMore2Fill,
} from "@remixicon/react";
import { useFormik } from "formik";
import { useRef } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useErrorColor, useLightDarkColor } from "../../constant/colors";
import { iconSize } from "../../constant/sizes";
import useBackOnClose from "../../hooks/useBackOnClose";
import backOnClose from "../../lib/backOnClose";
import formatBytes from "../../lib/formatBytes";
import formatDate from "../../lib/formatDate";
import RequiredForm from "../form/RequiredForm";
import BackOnCloseButton from "../independent/BackOnCloseButton";
import CContainer from "../independent/wrapper/CContainer";
import CustomDrawer from "../independent/wrapper/CustomDrawer";
import DrawerHeader from "./DrawerHeader";
import FileTypeIcon from "./FileTypeIcon";
import FileViewer from "./FileViewer";
import StringInput from "./input/StringInput";

interface Props {
  data: any;
}

const MoreOptions = ({ data }: Props) => {
  // Children
  const RenameDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const formik = useFormik({
      validateOnChange: false,
      initialValues: { nama: data.nama },
      validationSchema: yup
        .object()
        .shape({ nama: yup.string().required("Harus diisi") }),
      onSubmit: (values, { resetForm }) => {
        console.log(values);
      },
    });

    return (
      <>
        <MenuItem onClick={onOpen}>
          <HStack w={"100%"} justify={"space-between"}>
            <Text fontWeight={500}>Rename</Text>
          </HStack>
        </MenuItem>

        <CustomDrawer
          id={`rename-drawer-${data.id}`}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          header={<DrawerHeader title="Rename" />}
          footer={
            <>
              <Button className="btn-ap clicky" colorScheme="ap">
                Simpan
              </Button>
            </>
          }
        >
          <CContainer px={6}>
            <form id="renameForm" onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={!!formik.errors.nama}>
                <FormLabel>
                  Nama File
                  <RequiredForm />
                </FormLabel>
                <StringInput
                  name="nama"
                  placeholder="File Berharga"
                  onChange={formik.handleChange}
                  value={formik.values.nama}
                />
                <FormErrorMessage>
                  {formik.errors.nama as string}
                </FormErrorMessage>
              </FormControl>
            </form>
          </CContainer>
        </CustomDrawer>
      </>
    );
  };

  // SX
  const errorColor = useErrorColor();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="more options"
        icon={<Icon as={RiMore2Fill} />}
        borderRadius={"full"}
        size={"sm"}
        className="btn-clear"
        onClick={(e) => {
          e.stopPropagation();
        }}
      ></MenuButton>

      <Portal>
        <MenuList
          minW={"150px"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <RenameDrawer />

          <MenuItem>
            <HStack
              as={Link}
              to={data.path}
              target="_blank"
              w={"100%"}
              justify={"space-between"}
            >
              <Text fontWeight={500}>Download</Text>
              <Icon as={RiDownload2Line} fontSize={iconSize} />
            </HStack>
          </MenuItem>

          <MenuDivider />

          <MenuItem>
            <HStack w={"100%"} justify={"space-between"} color={errorColor}>
              <Text fontWeight={500}>Delete</Text>
              <Icon as={RiDeleteBinLine} fontSize={iconSize} />
            </HStack>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default function DokumenFileItem({ data }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  useBackOnClose(`file-viewer-${data.path}`, isOpen, onOpen, onClose);

  const dataType = data.path.split(".").pop().toLowerCase();

  // SX
  const lightDarkColor = useLightDarkColor();

  return (
    <>
      <CContainer
        flex={0}
        bg={lightDarkColor}
        borderRadius={12}
        onClick={onOpen}
        cursor={"pointer"}
        position={"relative"}
        overflow={"clip"}
      >
        <HStack justify={"space-between"} pl={3} pr={0} py={1}>
          <HStack>
            <Text fontSize={12} fontWeight={500} noOfLines={1}>
              {data.nama}
            </Text>
          </HStack>

          <MoreOptions data={data} />
        </HStack>

        <CContainer align={"center"} py={2} px={4} gap={1}>
          <FileTypeIcon type={dataType} fontSize={52} />
        </CContainer>

        <HStack opacity={0.4} p={2} justify={"space-between"}>
          <Text fontSize={11} opacity={0.4}>
            {formatBytes(data.size)}
          </Text>
          <Text fontSize={11}>{formatDate(data.created_at, "short")}</Text>
        </HStack>
      </CContainer>

      <Modal
        isOpen={isOpen}
        onClose={backOnClose}
        initialFocusRef={initialRef}
        size={"full"}
        allowPinchZoom
      >
        <ModalOverlay />
        <ModalContent m={0} border={"none"}>
          <ModalHeader ref={initialRef}>
            <HStack justify={"space-between"}>
              <Text fontSize={20} fontWeight={600}>
                Pratinjau
              </Text>
              <BackOnCloseButton aria-label="back on close button" />
            </HStack>
          </ModalHeader>

          <ModalBody>
            {/* <Text mb={4}>{data.nama}</Text> */}
            <CContainer my={"auto"} flex={0}>
              <FileViewer fileUrl={data.path} fileType={dataType} />
            </CContainer>
          </ModalBody>

          <ModalFooter>
            <Button
              as={Link}
              to={data.path}
              target="_blank"
              w={"100%"}
              colorScheme="ap"
              variant={"ghost"}
              leftIcon={<Icon as={RiDownload2Line} fontSize={iconSize} />}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}