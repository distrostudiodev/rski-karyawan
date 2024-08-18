import { ChakraProvider, useToast } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import NavContainer from "./components/independent/wrapper/NavContainer";
import TukarJadwal from "./components/independent/wrapper/TukarJadwal";
import UbahData from "./components/independent/wrapper/UbahData";
import "./globalStyle.css";
import useStatusBarColor from "./lib/statusBarColor";
import InternalServerErrorPage from "./pages/errorPage/InternalServerErrorPage";
import MaintenancePage from "./pages/errorPage/MaintenancePage";
import MissingPage from "./pages/errorPage/MissingPage";
import Landing from "./pages/Landing";
import LengkapiDataUser1 from "./pages/lengkapiUserData/LengkapiDataUser1";
import LengkapiDataUser2 from "./pages/lengkapiUserData/LengkapiDataUser2";
import LengkapiDataUser3 from "./pages/lengkapiUserData/LengkapiDataUser3";
import LengkapiDataUser4 from "./pages/lengkapiUserData/LengkapiDataUser4";
import Login from "./pages/Login";
import Aktivitas from "./pages/main/Aktivitas";
import AmbilFoto from "./pages/main/Beranda/AmbilFoto";
import Beranda from "./pages/main/Beranda/Beranda";
import Cuti from "./pages/main/Beranda/Cuti";
import Dokumen from "./pages/main/Beranda/Dokumen";
import EventDiklat from "./pages/main/Beranda/EventDiklat";
import Feedback from "./pages/main/Beranda/Feedback";
import FeedbackKuisioner from "./pages/main/Beranda/FeedbackKuisioner";
import Inbox from "./pages/main/Beranda/Inbox";
import Koperasi from "./pages/main/Beranda/Koperasi";
import Laporan from "./pages/main/Beranda/Laporan";
import Lembur from "./pages/main/Beranda/Lembur";
import PengajuanTukarJadwal from "./pages/main/Beranda/PengajuanTukarJadwal";
import SlipGajiku from "./pages/main/Beranda/SlipGajiku";
import DetailJadwal from "./pages/main/Jadwal/DetailJadwal";
import Jadwal from "./pages/main/Jadwal/Jadwal";
import DetailKaryawan from "./pages/main/Karyawan/DetailKaryawan";
import Karyawan from "./pages/main/Karyawan/Karyawan";
import Faqs from "./pages/main/Profil/Faqs";
import Kontak from "./pages/main/Profil/Kontak";
import Profil from "./pages/main/Profil/Profil";
import RiwayatPerubahanData from "./pages/main/Profil/RiwayatPerubahanData";
import SyaratDanKetentuan from "./pages/main/Profil/SyaratDanKetentuan";
import Onboarding from "./pages/Onboarding";
import EmailVerfication from "./pages/resetPassword/EmailVerfication";
import ForgotPassword from "./pages/resetPassword/ForgotPassword";
import NewPassword from "./pages/resetPassword/NewPassword";
import { globalTheme } from "./theme/globalTheme";
import Pengumuman from "./pages/main/Beranda/Pengumuman";
import { getCookie } from "typescript-cookie";
import req from "./lib/req";

function disableRightClick(event: MouseEvent) {
  event.preventDefault();
}

// styling notif bar color
const EndpointWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const setStatusBarPrimary = useStatusBarColor("#16b3ac", "#191919");
  const setStatusBarBody = useStatusBarColor("#ffffff", "#191919");
  const setStatusBarDark = useStatusBarColor("#191919", "#191919");

  useEffect(() => {
    // Dapatkan endpoint dari lokasi saat ini
    const endpoint = location.pathname.split("/").pop();
    switch (endpoint) {
      default:
        setStatusBarBody();
        break;
      case "beranda":
        setStatusBarPrimary();
        break;
      case "foto":
        setStatusBarDark();
        break;
    }
  }, [location, setStatusBarPrimary, setStatusBarBody, setStatusBarDark]);

  return <>{children}</>;
};

export const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    const authToken = getCookie("__auth_token");
    if (authToken) {
      req
        .get("/api/getuserinfo")
        .then((r) => {
          if (r.status === 200) {
            localStorage.setItem("dcs", r.data.data.data_completion_step);
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            status: "error",
            title:
              e.response.data.message || "Maaf terjadi kesalahan pada sistem",
            position: "bottom-right",
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tambahkan event listener ke objek document saat komponen dimuat
    document.addEventListener("contextmenu", disableRightClick);

    // Bersihkan event listener saat komponen dibongkar
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <ChakraProvider theme={globalTheme}>
      <BrowserRouter>
        <EndpointWrapper>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/forgot-password-email-verif"
              element={<EmailVerfication />}
            />
            <Route path="/new-password" element={<NewPassword />} />
            <Route
              path="/lengkapi-data-personal-1"
              element={<LengkapiDataUser1 />}
            />
            <Route
              path="/lengkapi-data-personal-2"
              element={<LengkapiDataUser2 />}
            />
            <Route
              path="/lengkapi-data-personal-3"
              element={<LengkapiDataUser3 />}
            />
            <Route
              path="/lengkapi-data-personal-4"
              element={<LengkapiDataUser4 />}
            />
            <Route
              path="/beranda"
              element={
                <NavContainer active={0}>
                  <Beranda />
                </NavContainer>
              }
            />
            <Route
              path="/inbox"
              element={
                <NavContainer active={3}>
                  <Inbox />
                </NavContainer>
              }
            />
            <Route
              path="/presensi/foto"
              element={
                <NavContainer active={0} noNavs>
                  <AmbilFoto />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/cuti"
              element={
                <NavContainer active={0} noNavs>
                  <Cuti />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/tukar-jadwal"
              element={
                <NavContainer active={0} noNavs>
                  <TukarJadwal title="Pengajuan Tukar Jadwal" active={0}>
                    <PengajuanTukarJadwal />
                  </TukarJadwal>
                </NavContainer>
              }
            />
            <Route
              path="/beranda/lembur"
              element={
                <NavContainer active={0} noNavs>
                  <Lembur />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/event-diklat"
              element={
                <NavContainer active={0} noNavs>
                  <EventDiklat />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/slip-gajiku"
              element={
                <NavContainer active={0} noNavs>
                  <SlipGajiku />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/dokumen"
              element={
                <NavContainer active={0} noNavs>
                  <Dokumen />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/feedback"
              element={
                <NavContainer active={0} noNavs>
                  <Feedback />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/feedback/:user_id"
              element={
                <NavContainer active={0} noNavs>
                  <FeedbackKuisioner />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/koperasi"
              element={
                <NavContainer active={0} noNavs>
                  <Koperasi />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/laporan"
              element={
                <NavContainer active={0} noNavs>
                  <Laporan />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/pengumuman"
              element={
                <NavContainer active={0} noNavs>
                  <Pengumuman />
                </NavContainer>
              }
            />
            <Route
              path="/jadwal"
              element={
                <NavContainer active={1}>
                  <Jadwal />
                </NavContainer>
              }
            />
            <Route
              path="/jadwal/:currentJadwalId"
              element={
                <NavContainer active={1} noNavs>
                  <DetailJadwal />
                </NavContainer>
              }
            />
            <Route
              path="/karyawan"
              element={
                <NavContainer active={2}>
                  <Karyawan />
                </NavContainer>
              }
            />
            <Route
              path="/karyawan/detail"
              element={
                <NavContainer active={2} noNavs>
                  <DetailKaryawan />
                </NavContainer>
              }
            />
            <Route
              path="/beranda/aktivitas"
              element={
                <NavContainer active={0} noNavs>
                  <Aktivitas />
                </NavContainer>
              }
            />
            <Route
              path="/profil"
              element={
                <NavContainer active={4}>
                  <Profil />
                </NavContainer>
              }
            />
            <Route
              path="/profil/ubah"
              element={
                <NavContainer active={4} noNavs>
                  <UbahData title="Ubah Data Personal" active={0} />
                </NavContainer>
              }
            />
            <Route
              path="/profil/edit/riwayat"
              element={
                <NavContainer active={4} noNavs>
                  <RiwayatPerubahanData />
                </NavContainer>
              }
            />
            <Route
              path="/profil/syarat-dan-ketentuan"
              element={
                <NavContainer active={4} noNavs>
                  <SyaratDanKetentuan />
                </NavContainer>
              }
            />
            <Route
              path="/profil/faqs"
              element={
                <NavContainer active={4} noNavs>
                  <Faqs />
                </NavContainer>
              }
            />
            <Route
              path="/profil/kontak"
              element={
                <NavContainer active={4} noNavs>
                  <Kontak />
                </NavContainer>
              }
            />

            <Route path="servererror" element={<InternalServerErrorPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<MissingPage />} />
          </Routes>
        </EndpointWrapper>
      </BrowserRouter>
    </ChakraProvider>
  );
};
