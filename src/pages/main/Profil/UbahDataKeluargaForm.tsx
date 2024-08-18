import {
  Box,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DeleteAnggotaKeluarga from "../../../components/dependent/DeleteAnggotaKeluarga";
import AddFamily from "../../../components/dependent/input/dedicated/AddFamily";
import EditFamily from "../../../components/dependent/input/dedicated/EditFamily";
import FlexLine from "../../../components/independent/FlexLine";
import CContainer from "../../../components/independent/wrapper/CContainer";
import NoData from "../../../components/independent/NoData";
import RequestPatchDataButton from "../../../components/dependent/RequestPatchDataButton";

interface Props {
  data: any[];
}

export default function UbahDataKeluargaForm({ data }: Props) {
  const [newItemAdded, setNewItemAdded] = useState(false);

  const formik = useFormik({
    validateOnChange: false,

    initialValues: {
      keluarga: data as any[],
    },

    validationSchema: yup.object().shape({
      keluarga: yup
        .array()
        .min(1, "Keluarga harus diisi")
        .required("Keluarga harus diisi"),
    }),

    onSubmit: (values, { resetForm }) => {
      console.log(values);
      // TODO hit api simpan data personal 2
    },
  });

  // SX

  return (
    <>
      <CContainer flex={0} gap={6}>
        <AnimatePresence>
          {formik.values.keluarga &&
            formik.values.keluarga.length > 0 &&
            formik.values.keluarga.map((anggota, i) => (
              <motion.div
                key={anggota.id}
                initial={{
                  opacity: newItemAdded ? 0 : 1,
                  scale: newItemAdded ? 0.5 : 1,
                  background: newItemAdded ? "p.500 !important" : "",
                }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, scale: 0.5, height: 0 }}
                transition={{ duration: newItemAdded ? 0.5 : 0.3 }}
              >
                <VStack align={"stretch"} borderRadius={8}>
                  <HStack justify={"space-between"} mr={-1}>
                    <Text fontWeight={600} fontSize={16}>
                      {anggota.nama}
                    </Text>

                    <HStack>
                      <EditFamily
                        data={anggota}
                        id={`lengkapi-data-user-2-edit-data-keluarga-${anggota.id}`}
                        name="keluarga"
                        onConfirm={(inputValue) => {
                          const newKeluarga = [...formik.values.keluarga];
                          const index = newKeluarga.findIndex(
                            (item) => item.id === anggota.id
                          );

                          if (index !== -1) {
                            newKeluarga[index] = {
                              ...inputValue,
                              id: anggota.id,
                            };
                            formik.setFieldValue("keluarga", newKeluarga);
                          }
                        }}
                      />

                      <DeleteAnggotaKeluarga
                        index={i}
                        data={anggota}
                        onDelete={(index) => {
                          setNewItemAdded(false);
                          setTimeout(() => {
                            formik.setFieldValue(
                              "keluarga",
                              formik.values.keluarga.filter(
                                (_, i) => i !== index
                              )
                            );
                          }, 50);
                        }}
                      />
                    </HStack>
                  </HStack>

                  <>
                    <HStack>
                      <Text opacity={0.4}>Hubungan Keluarga</Text>
                      <FlexLine />
                      <Text>{anggota.hubungan_keluarga.label}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Status Hidup</Text>
                      <FlexLine />
                      <Text>{anggota.status_hidup.label}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Pekerjaan</Text>
                      <FlexLine />
                      <Text>{anggota.pekerjaan}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Nomor Telepon</Text>
                      <FlexLine />
                      <Text>{anggota.telepon}</Text>
                    </HStack>
                    <HStack>
                      <Text opacity={0.4}>Email</Text>
                      <FlexLine />
                      <Text>{anggota.email}</Text>
                    </HStack>
                  </>
                </VStack>
              </motion.div>
            ))}
        </AnimatePresence>
      </CContainer>

      {/* @ts-ignore */}
      {(!formik.values.keluarga || formik.values.keluarga?.length === 0) && (
        <NoData my={"auto"} />
      )}
      <Box mt={"auto"}>
        <form id="LengkapiDataUser2Form" onSubmit={formik.handleSubmit}>
          <FormControl isInvalid={!!formik.errors.keluarga} mt={6}>
            <HStack>
              <AddFamily
                id="lengkapi-data-user-2-tambah-data-keluarga"
                name="keluarga"
                onConfirm={(inputValue) => {
                  setNewItemAdded(true);
                  const newKeluarga = [...formik.values.keluarga];
                  newKeluarga.push({
                    ...inputValue,
                    id: new Date().getTime().toString(),
                  });
                  formik.setFieldValue("keluarga", newKeluarga);
                }}
              />

              <RequestPatchDataButton
                validator={() => {
                  formik.validateField("keluarga");
                }}
                column="keluarga"
                payload={formik.values.keluarga}
              />
            </HStack>
            <FormErrorMessage>
              {formik.errors.keluarga as string}
            </FormErrorMessage>
          </FormControl>
        </form>
      </Box>
    </>
  );
}