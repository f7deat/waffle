export const dynamic = 'force-dynamic';

import { apiGetSiteSetting } from "@/services/setting";
import { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCamera, faCaretDown, faCoffee, faCompass, faEye, faFire, faGift, faLayerGroup, faLocationDot, faRankingStar, faSearch, faShop, faSignHanging, faWaterLadder } from "@fortawesome/free-solid-svg-icons";
import Province from "./components/province";
import Influencer from "./components/influencer";
import Article from "./components/article";
import Place from "./components/place";
import Product from "./components/product";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await apiGetSiteSetting();
    return {
      title: settings?.title || "DefZone.Net",
      description: settings?.description || "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  } catch (error) {
    // Fallback to defaults if API call fails
    return {
      title: "DefZone.Net",
      description: "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  }
}

export default async function Home() {

  return (
    <main className="bg-slate-100">
      <section className="relative w-full px-4 pt-36 pb-20 md:pb-28 overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center object-cover"
            data-alt="Cinematic wide-angle view of coastal Hai Phong and Lan Ha Bay at golden hour sunset, showing tranquil emerald waters, karst limestone peaks, and stylish terrace cafes glowing warmly with string lights and happy people dining outdoors, editorial travel magazine photography style with warm coral, golden amber, and deep emerald green palette."
            style={{
              backgroundImage:
                'url("https://datviettour.com.vn/uploads/images/tin-tuc-SEO/mien-bac/ha-long/danh-thang/Tren-dao-Reu.jpg")'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-on-surface/40 to-on-surface/65" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative z-10 container mx-auto px-gutter flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Nền tảng Khám phá Du lịch &amp; Ẩm thực Bản địa
            </span>
          </div>
          <h1 className="font-bold 2xl:text-5xl text-display max-w-4xl text-surface tracking-tight mb-4 drop-shadow-sm">
            Đi đâu hôm nay,{" "}
            <span className="text-primary-container underline decoration-primary-container/40 underline-offset-8">
              trải nghiệm chất
            </span>{" "}
            hôm nay!
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl mb-10 leading-relaxed font-normal">
            Khám phá quán ngon, góc check-in đẹp và những hành trình đáng nhớ tại Hải
            Phòng &amp; khắp mọi miền Việt Nam.
          </p>
          {/* Floating Search Glassmorphism Card */}
          <div className="w-full max-w-5xl bg-surface-container-lowest/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch gap-3">
            {/* City dropdown */}
            <div className="relative flex-1 bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center cursor-pointer group hover:bg-surface-container transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>{" "}
                Điểm đến
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-title text-body-lg font-semibold text-on-surface">
                  Hải Phòng
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-transform group-hover:translate-y-0.5">

                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline truncate">
                Hồng Bàng, Ngô Quyền, Đồ Sơn, Cát Bà
              </span>
            </div>
            {/* Category dropdown */}
            <div className="relative flex-1 bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center cursor-pointer group hover:bg-surface-container transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  <FontAwesomeIcon icon={faLayerGroup} />
                </span>{" "}
                Trải nghiệm
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-title text-body-lg font-semibold text-on-surface truncate">
                  🍽️ Ăn uống &amp; Ẩm thực
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-transform group-hover:translate-y-0.5">
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline truncate">
                Cà phê, Check-in, Khách sạn
              </span>
            </div>
            {/* Keyword search input */}
            <div className="relative flex-[1.4] bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  <FontAwesomeIcon icon={faSearch} />
                </span>{" "}
                Bạn tìm gì?
              </span>
              <input
                className="w-full bg-transparent font-title text-body-lg text-on-surface placeholder:text-outline/70 focus:outline-none mt-0.5"
                placeholder="Nhập món ăn, tên quán hoặc địa danh..."
                type="text"
              />
            </div>
            {/* CTA Button */}
            <button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">
                <FontAwesomeIcon icon={faCompass} />
              </span>
              <span>Khám phá ngay</span>
            </button>
          </div>
          {/* Quick Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-4xl">
            <span className="font-label-sm text-label-sm text-surface-container-highest uppercase tracking-wider mr-1">
              Tìm nhanh:
            </span>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🍜 Bánh đa cua Hải Phòng
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              ☕ Cafe view sông Tam Bạc
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              📸 Ga Hải Phòng check-in
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🏖️ Sunset Cát Bà
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🍹 Cà phê cốt dừa
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🥖 Bánh mì que chính gốc
            </button>
          </div>
        </div>
      </section>
      <section className="w-full py-16 bg-surface px-4">
        <div className="container mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-1 bg-secondary rounded-full" />
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Phân loại trải nghiệm
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Danh mục trải nghiệm
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Chọn phong cách khám phá bạn yêu thích hôm nay cùng cộng đồng Đi Đâu
                Đây
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Hơn 9.500+ địa điểm đã xác thực
              </span>
            </div>
          </div>
          {/* 8 Category Grid Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Cat 1 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Traditional hot Vietnamese crab noodle soup banh da cua steaming bowl with fresh herbs, crispy shallots and fresh seafood toppings, warm lighting, editorial food photography."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMAufE-mkJBrKmhnmF8cLkQ4CM7HElzwmRbBkLrGVC-OwC-I3NVCjCfPmSUbx3K3ZbSfTRv24LObztsLqqn7S1eeQwG_HC5RVXH_4EErsLb5EgFzE54pF2-nOT_7n7dP0mqtA9f3IPBK1gkAvjQLdE5pR4vTZcYC04AhcXpsPFtWvNR-bghZLW5RBJFASK8e12KsN2qUHYbtzAkE8GyhRjBRbYgogJG1pWM0RqoVQgelKGDL2Kedi7gQ")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container text-on-primary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faShop} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-primary-fixed transition-colors">
                  Quán ăn ngon
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  3,420+ đặc sản &amp; hải sản
                </p>
              </div>
            </a>
            {/* Cat 2 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Cozy sunlit Vietnamese cafe interior with rustic wooden furniture, lush indoor plants, exposed brick walls, and artisanal coffee drinks on table, modern warm aesthetics."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC56-0n_lxgebkqCG4zrmu4HYrD3_uUIMeJNz8h4AhNUjuE1hItPm8yTStx1b9iCJJ4zJ0VGkJ56nVOD870k4jlh9zDZRXT_3IKJI6vf4vUVABemwTtCRwEglIR3PsjxQoPIH6Bt6W9faTZ18xLwt_vberJT2o5si-qgDLIdo1pgErBwav5We8iR5a28CjVt8g7iveIh6-3CL3diyTR_POQ3rwzcSOO5iIMLzdozMFFVIYYPh5J3-N2Fg")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-on-secondary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faCoffee} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-secondary-fixed transition-colors">
                  Cafe &amp; Trà
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  1,850+ góc chill, làm việc
                </p>
              </div>
            </a>
            {/* Cat 3 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Young travelers capturing Instagram photos at iconic vintage French colonial railway station in Hai Phong with yellow ochre facades and sunlight streams."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWCUUv2m06TyXqjr8mtOmMxkumZ79EQwyRaTsUeB0DWJuh8CghOxSuY_zjFWyF7QSsYiCSjYwYbJNUtncNCcibInaw-c_uVXgC_Hfs8d_oF4hCUM1gkd9vTQoVuIEno1oCHiPFuaJ0rHscZTSbva2Yca9krhyOSkFeAfGUsMhqUPiyPV7ubYQY93AwotovxnwvSdxZppksh_L4_LGiA3v_o377gFaUiG0AtgvtMeJnjXindTpTLSPrsA")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faCamera} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-tertiary-fixed transition-colors">
                  Điểm check-in hot
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  1,290+ toạ độ triệu view
                </p>
              </div>
            </a>
            {/* Cat 4 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Wooden cruise boat gliding peacefully through crystal clear emerald water in Lan Ha Bay surrounded by dramatic karst limestone formations."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjRRYRBeltm1HUQGhEAZUURJr-u4GuG1tT41-b72fK34SSq57pUAIVWFu4bq0_jVpc0pOkuw-wzp4bBNgUBOz3FTaMeU7aV8AQjhLlia9QoigwyiwEGAcWi9hUOyB5iIN1EI5NjccN6547bdKmQyhSC3awufbZZJztuHo8JymZ1EQfxYwvjg4OQVVCLK1SWfzFgH_5qNPb9kFpMBmgugObdJiV1V1s-5xK5TRqlkq_9w_RaPkle7gX_g")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-on-secondary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faCompass} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-secondary-fixed transition-colors">
                  Du lịch &amp; Khám phá
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  860+ tour trải nghiệm, biển
                </p>
              </div>
            </a>
            {/* Cat 5 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Chic boutique homestay bedroom with natural linen bedding, warm bamboo woven lamps, wooden ceiling beams and green plants."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBolnoCWaXEG6emfNbO4-Cymc-6SVbLFa2NurN5t-ekrtI_P-BeDpt1t3fYaLMpNE5rU_u1C7W4OvXcGav9Z3gCLLRceSD-8N1UsdH0E3EfGciR2ONdHSQYtIsKDr0Ys4Rh_bj6Kzq690t45ngbOyxFhEJRHdJWrSPg6nQXvnFDm3udd9tVE49xIScihPO2PaO01_JxNhLDPZXVru1wvsdGzTpR_MoOjjOTu7W0y0-7tCM-o53ygLAibg")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container text-on-primary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <FontAwesomeIcon icon={faBed} />
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-primary-fixed transition-colors">
                  Khách sạn &amp; Homestay
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  940+ lưu trú phong cách
                </p>
              </div>
            </a>
            {/* Cat 6 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Luxury beachfront resort infinity swimming pool overlooking tropical ocean horizon with elegant daybeds and palm trees at dusk."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVvh4zIc3W5_kQ1U_0XDpSLquF5QyICBRKuyq9zKPTruUY3eweTPioSengeNL7h4kYDFKQck2UU9m7U98ZWO93xCm-jdcWNRnyFHx5S24mNZS_gPnkap82sn8yvLHYBYHKbcV41Sw5EwjzCyzZYQU6yTb-knrkNXf1PJpA7Le6zp9Q-_eG6xTLwH_6lcOuui_J06JJQluUwbwQEvj0SkrHt8-eyHwO5w6X1OPUSAWdQGMrubjEw1FwKw")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-on-secondary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faWaterLadder} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-secondary-fixed transition-colors">
                  Resort &amp; Nghỉ dưỡng
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  320+ khu nghỉ dưỡng biển
                </p>
              </div>
            </a>
            {/* Cat 7 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Vibrant night market street food stall in Vietnam packed with young foodies, colorful neon signs, aromatic skewers on charcoal grill."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAeU2RmfLBX9n4cNGndLmdvrvOMlaIwYnW5pIOHkLCUisj3XJ5TNiaAUioEcklHJvOZDXCF5sK6XshVMVLUkKoTRcVVPe8jWHkk_jqBG8cPvs7Dl5ZlDIk-0DgjY3MFtdWHTPSMFOddryCZzWpFNg-CxueVYAEC3IXBhR0X4jeRgW59fNqqVhi_K097qP0bdYXHTZxt4aAXKCW93BaqXigNmvZSDpOs04xjBjdggOrOTTsxc4B8xfxVEw")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-on-primary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faFire} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-primary-fixed transition-colors">
                  Địa điểm Hot Trend
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  Top TikTok &amp; Instagram
                </p>
              </div>
            </a>
            {/* Cat 8 */}
            <a
              className="group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 h-64 cursor-pointer"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                data-alt="Smiling Vietnamese travel content creator recording a food vlog with compact mirrorless camera and mini microphone in lively old quarter cafe."
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvOP8M-beb3BqaY_fyOunvbdZsHdVYssgKFEBudEaKLnh1qBmag4uf-VzsTBS_Dec8OsPDmiXipo6tw2jjWjhrcgEng5Ng9nxZ7qSeBghwCgGEgirM37Z33in6ZTs-iZgR-0B_n2Y9fP5qokshDsHXLm8qxj0q1cvmuqinAP86KGU85vqfsxvKCFOq7hJ-1xFFXmNPH3dKU80Z6SgPx9TjCKWV6KEcuAkMf_3zED4CG1csSSE1M9ISOw")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-tertiary text-on-tertiary mb-3 shadow-md group-hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faGift} />
                  </span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-surface font-bold group-hover:text-tertiary-fixed transition-colors">
                  Influencer &amp; Blogger
                </h3>
                <p className="font-body-sm text-body-sm text-surface-container-high mt-0.5">
                  450+ nhà sáng tạo uy tín
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
      <Place />

      <Province />

      {/* 5. HAI PHÂN MỤC ĐẶC SẮC (Special Curations) */}
      <section className="w-full py-16 bg-surface-container-low px-4">
        <div className="container mx-auto px-gutter flex flex-col gap-16">
          {/* Section 5A: Cafe chill check-in */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-1 bg-secondary rounded-full" />
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Góc chill &amp; Sống ảo
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Quán cafe có góc check-in cực chill
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Không gian nghệ thuật, view bờ sông thoáng mát và những thức uống
                  sáng tạo
                </p>
              </div>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                <button className="px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm transition-all">
                  Tất cả góc chill
                </button>
                <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-sm transition-all">
                  View biển
                </button>
                <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-sm transition-all">
                  Sống ảo
                </button>
                <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-sm transition-all">
                  Làm việc
                </button>
                <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm shadow-sm transition-all">
                  Sân vườn thoáng đãng
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cafe 1 */}
              <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative w-full h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    data-alt="Charming rooftop cafe overlooking Tam Bac river in Hai Phong during sunset with string lights and woven rattan chairs."
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBlgoZOy2e0sZhSy04NU3yoCgYcRJNH6qjboBlV_fKhtWaNeuBPwC7NvkVB9VEwNU94jeytJKLLftqlUqOVtEQWJeDjfYY1Uw6aP-w5M0zjFiRQfeFSIH4kwsgtajKv71IqZmMtAzY48s0sIClaRziwsjvlnD5BIjjg2tIfJ0nbSZYrv_vk6obzP2EuUOQoSA-Zw3LwXHRzz4f3Pz2orslOYUkAfnoZ21lfgQvzLfJKiqz2kwLtKAahhw")'
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm text-secondary font-semibold">
                    View sông
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-on-surface/75 text-surface font-label-sm text-label-sm flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>{" "}
                    4.9
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors">
                      Riverside Tam Bạc Rooftop
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">
                      Tam Bạc, Hồng Bàng, Hải Phòng
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-label-sm font-label-sm text-primary font-semibold">
                        35.000đ - 65.000đ
                      </span>
                      <span className="text-outline">•</span>
                      <span className="text-body-sm text-on-surface-variant">
                        Hoàng hôn cực đẹp
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-body-sm text-outline">
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        wifi
                      </span>{" "}
                      Wifi mạnh
                    </span>
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        chair
                      </span>{" "}
                      Không gian mở
                    </span>
                  </div>
                </div>
              </div>
              {/* Cafe 2 */}
              <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative w-full h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    data-alt="Bohemian garden coffee space with green monstera plants, glass greenhouse roof, wooden vintage stools and natural daylight."
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPQ08hKwXWTQQ3kNjlD_5QUJSiUrKr-pIXE8blNdQzd0R2K6DT7PfC-EybaFJtf-fCsyL067I5Z-2O32kl8v8bbdzQdYQWRRdKwYvbJFIY3MFS7yVKSDtdOFxBjXvv6HO2BRMkDQw-MGnOzzwfdzssC3g_9DchT84oRarPX_CG6g3T58_m4hHKM3USANgB7CJi1Xf7md95mOY70OrxpQxXqBEUejyx6C2uoGppG1Hwn2Q_036-Rev2aw")'
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm text-secondary font-semibold">
                    Sân vườn
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-on-surface/75 text-surface font-label-sm text-label-sm flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>{" "}
                    4.8
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors">
                      The Green Garden House
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">
                      Nguyễn Đức Cảnh, Lê Chân, Hải Phòng
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-label-sm font-label-sm text-primary font-semibold">
                        40.000đ - 70.000đ
                      </span>
                      <span className="text-outline">•</span>
                      <span className="text-body-sm text-on-surface-variant">
                        Không gian xanh mát
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-body-sm text-outline">
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        yard
                      </span>{" "}
                      Vườn cây
                    </span>
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        pets
                      </span>{" "}
                      Thân thiện pet
                    </span>
                  </div>
                </div>
              </div>
              {/* Cafe 3 */}
              <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative w-full h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    data-alt="Minimalist modern Scandinavian style coffee bar with clean oak wood counters, brushed aluminum espresso machine and large glass windows."
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDF0b6Fybma0rkNti4FjV4ZLyuTT4nrA0GuT_0uCOEcH8eKCzzKOXVbNod-3HWn6GZXYSBm1t29pVio-3iGDTwV28yWbB4NwcQB-cfs2faht5lIOTEYvoZWd4Zi-vgq-H3xJi7vjar7SXO9WZHj5tCaHWiWKdFDCb3GEtgeU5v6b-wzKZy9dSWHFrTunwig7w4IRxQJLnb__X6IaHO1qrO2ezHblJbgesOq2gau9iQNoZH4fFtEQHOnfQ")'
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm text-secondary font-semibold">
                    Làm việc
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-on-surface/75 text-surface font-label-sm text-label-sm flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>{" "}
                    4.9
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors">
                      Khuê Coffee &amp; Workshop
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">
                      Trần Phú, Ngô Quyền, Hải Phòng
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-label-sm font-label-sm text-primary font-semibold">
                        45.000đ - 75.000đ
                      </span>
                      <span className="text-outline">•</span>
                      <span className="text-body-sm text-on-surface-variant">
                        Yên tĩnh tuyệt đối
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-body-sm text-outline">
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        bolt
                      </span>{" "}
                      Ổ cắm tiện lợi
                    </span>
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        book
                      </span>{" "}
                      Sách &amp; Tạp chí
                    </span>
                  </div>
                </div>
              </div>
              {/* Cafe 4 */}
              <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative w-full h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    data-alt="Scenic cliffside cafe overlooking Cat Ba sea bay with wooden sundeck terrace and colorful parasols."
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC39B3R1cwYGzTU5Z4PBcgHq7ArtRxy2RFwipwY23dive4_56-0JetwzzHMxagUbx7MxEeGhuSCDpVifZ0OLPKvY8SV00GiVOuwoQggLYghCLarIHRR4v-z20dWmrxNE8iVG39gt6K7ZZYECevohumHnjVthgMGkOQGK6HxwP_n-Ek9ewxmsrUZX9GuMxGuZlse-LfRxpA7ANlr-zWtV6QbWtcEycT3jW8EwtPpDLOlkq0kydEnmC9i8A")'
                    }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm text-secondary font-semibold">
                    View biển
                  </span>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-on-surface/75 text-surface font-label-sm text-label-sm flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>{" "}
                    4.8
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors">
                      Sunset Deck Cát Bà Bay
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-1">
                      Đường 1/4, Thị trấn Cát Bà, Hải Phòng
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-label-sm font-label-sm text-primary font-semibold">
                        45.000đ - 80.000đ
                      </span>
                      <span className="text-outline">•</span>
                      <span className="text-body-sm text-on-surface-variant">
                        Bắt trọn hoàng hôn
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-body-sm text-outline">
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        wb_twilight
                      </span>{" "}
                      Hoàng hôn
                    </span>
                    <span className="flex items-center gap-1 text-[12px]">
                      <span className="material-symbols-outlined text-[15px]">
                        local_bar
                      </span>{" "}
                      Cocktail chill
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Product />
        </div>
      </section>
      <Influencer />
      <Article />
      {/* 8. KHỐI KẾT NỐI CỘNG ĐỒNG & DOANH NGHIỆP (Community Contributions) */}
      <section className="w-full py-16 bg-surface px-4">
        <div className="container mx-auto px-gutter">
          <div className="relative rounded-3xl overflow-hidden bg-secondary text-on-secondary p-8 sm:p-12 lg:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Background decorative ambient circles */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-4">
                <span className="material-symbols-outlined text-[16px]">
                  <FontAwesomeIcon icon={faSignHanging} />
                </span>
                <span>Dành cho Chủ cơ sở kinh doanh &amp; Người sáng tạo</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-secondary font-bold tracking-tight mb-4">
                Bạn sở hữu một quán cafe đẹp hay quán ăn ngon nức tiếng?
              </h2>
              <p className="font-body-lg text-body-lg text-secondary-fixed font-normal leading-relaxed mb-6">
                Đưa không gian và hương vị độc đáo của bạn đến với hơn 2.5 triệu
                người yêu ẩm thực, du lịch mỗi tháng trên hệ sinh thái Đi Đâu Đây.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faShop} />
                  </span>
                  <span>Chia sẻ địa điểm của bạn</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-surface-container-lowest text-secondary hover:bg-secondary-fixed font-label-lg text-label-lg shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    <FontAwesomeIcon icon={faRankingStar} />
                  </span>
                  <span>Trở thành Creator</span>
                </button>
              </div>
            </div>
            {/* Right Side Stat Bento */}
            <div className="relative z-10 w-full lg:w-auto grid grid-cols-2 gap-4 flex-shrink-0">
              <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-display text-display xl:text-2xl text-tertiary-fixed font-bold leading-none mb-1">
                  9.5K+
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed">
                  Địa điểm tin cậy
                </span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-display text-display xl:text-2xl text-primary-fixed font-bold leading-none mb-1">
                  2.5M+
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed">
                  Lượt xem mỗi tháng
                </span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-display text-display xl:text-2xl text-surface font-bold leading-none mb-1">
                  450+
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed">
                  KOLs đồng hành
                </span>
              </div>
              <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-display text-display xl:text-2xl text-secondary-fixed font-bold leading-none mb-1">
                  98%
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed">
                  Đánh giá hài lòng
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
