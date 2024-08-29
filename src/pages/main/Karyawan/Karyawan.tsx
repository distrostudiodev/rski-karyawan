import { Box, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import SearchComponent from "../../../components/dependent/input/SearchComponent";
import Retry from "../../../components/dependent/Retry";
import FilterKaryawan from "../../../components/independent/FilterKaryawan";
import NoData from "../../../components/independent/NoData";
import NotFound from "../../../components/independent/NotFound";
import Skeleton from "../../../components/independent/Skeleton";
import CContainer from "../../../components/independent/wrapper/CContainer";
import { useContentBgColor, useLightDarkColor } from "../../../constant/colors";
import { Interface__Karyawan } from "../../../constant/interfaces";
import { iconSize } from "../../../constant/sizes";
import useDataState from "../../../hooks/useDataState";
import useScrollToTop from "../../../hooks/useScrollToTop";
import getUserData from "../../../lib/getUserData";
import DetailKaryawan from "./DetailKaryawan";
import useFilterKaryawan from "../../../global/useFilterKaryawan";

export default function Karyawan() {
  useScrollToTop();

  const user: Interface__Karyawan = getUserData();

  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>("");

  const { filterKaryawan } = useFilterKaryawan();

  const { error, notFound, loading, data, retry } = useDataState<
    Interface__Karyawan[]
  >({
    initialData: undefined,
    url: "/api/user-unit-kerja",
    payload: {
      ...(filterKaryawan?.status?.length > 0 && {
        status: filterKaryawan.status.map((sp: any) => sp.value),
      }),
    },
    dependencies: [filterKaryawan],
  });

  const fd = data?.filter((item) => {
    const searchTerm = search?.toLowerCase();
    return item.user.nama.toLowerCase().includes(searchTerm as string);
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchMode) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 200);
    }
  }, [searchInputRef, searchMode]);

  // SX
  const lightDarkColor = useLightDarkColor();
  const contentBgColor = useContentBgColor();

  return (
    <CContainer flex={1}>
      <Box
        position={"sticky"}
        top={"0"}
        bg={lightDarkColor}
        borderBottom={"1px solid var(--divider2) !important"}
        zIndex={2}
      >
        <HStack
          bg={lightDarkColor}
          h={"56px"}
          pl={5}
          pr={4}
          py={4}
          justify={"space-between"}
          position={"sticky"}
          top={0}
          left={0}
          zIndex={99}
          w={"100%"}
        >
          <HStack
            w={searchMode ? "0px" : "40px"}
            ml={searchMode ? "-12px" : ""}
          ></HStack>

          {!searchMode && (
            <Text
              textAlign={"center"}
              noOfLines={1}
              fontWeight={600}
              fontSize={[16, null, 18]}
            >
              {`Karyawan ${user?.unit_kerja?.[0]?.nama_unit || ""} `}
            </Text>
          )}

          <HStack
            w={searchMode ? "100%" : "40px"}
            justify={searchMode ? "start" : "end"}
            transition={"200ms"}
          >
            <IconButton
              aria-label="Search Button"
              icon={<Icon as={RiSearchLine} fontSize={iconSize} />}
              borderRadius={"full"}
              size={"sm"}
              className="btn"
              onClick={() => {
                setSearchMode(true);
              }}
              display={!searchMode ? "flex" : "none"}
            />

            <SearchComponent
              name="search"
              inputValue={search}
              onChangeSetter={(inputValue) => {
                setSearch(inputValue);
              }}
              inputRef={searchInputRef}
              display={searchMode ? "flex" : "none"}
              minW={"0px !important"}
              size="sm"
            />

            <IconButton
              display={searchMode ? "flex" : "none"}
              transition={"200ms"}
              aria-label="Tombol Kembali"
              icon={<Icon as={RiCloseLine} fontSize={20} />}
              className="btn"
              size={"sm"}
              borderRadius={"full"}
              onClick={() => {
                setSearchMode(false);
                setSearch("");
              }}
            />
          </HStack>
        </HStack>

        <FilterKaryawan transform={"translateY(10px)"} />
      </Box>

      <CContainer flex={1} p={5} gap={3} bg={contentBgColor}>
        {error && (
          <>
            {notFound && <NotFound />}

            {!notFound && (
              <Box my={"auto"}>
                <Retry loading={loading} retry={retry} />
              </Box>
            )}
          </>
        )}

        {!error && (
          <>
            {loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} h={"80px"} />
              ))}

            {(!data || (data && data.length === 0)) && (
              <NoData label="Tidak ada karyawan" />
            )}

            {fd && fd.length === 0 && (
              <NotFound label="Karyawan tidak ditemukan" />
            )}

            {fd && fd.length > 0 && (
              <>
                {fd.map((karyawan, i) => (
                  <DetailKaryawan
                    key={i}
                    karyawan={karyawan}
                    listKaryawan={data}
                    index={i}
                    bg={lightDarkColor}
                  />
                ))}
              </>
            )}
          </>
        )}
      </CContainer>
    </CContainer>
  );
}
