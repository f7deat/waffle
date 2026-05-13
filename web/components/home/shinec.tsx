"use client";

import { apiGetAlbumPhotos } from "@/services/album";
import { apiContactSubmit } from "@/services/contact";
import { AlbumPhoto } from "@/typings/album";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type LandUseItem = {
    label: string;
    value: string;
};

type SectionHeadingProps = {
    eyebrow: string;
    title: string;
};

const advantages: string[] = [
    "Tối ưu chi phí đầu tư xây dựng",
    "Thủ tục pháp lý đầu tư minh bạch",
    "Tuyển dụng hiệu quả",
    "Mô hình cụm công nghiệp sinh thái",
    "Linh hoạt trong thu hút đầu tư",
    "Đội ngũ nhân viên tận tâm, hỗ trợ và kết nối",
];

type ContactFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  note: "",
};

const infrastructures: string[] = [
    "Diện tích lòng đường giao thông nội bộ: 15m",
    "Cấp nước công nghiệp: 30m3/ha/ngày đêm, trạm bơm tăng áp công suất 270m3/h",
    "Chỉ tiêu phát sinh nước thải: >80% chỉ tiêu nước cấp",
    "Chất thải rắn phát sinh: >0,3 tấn/ha",
    "Tỷ lệ thu gom xử lý chất thải rắn: 100%",
    "Mạng lưới cấp nước chữa cháy kết hợp mạng nước sản xuất",
    "16 máy biến áp hạ áp cho các nhà đầu tư thứ cấp",
    "3 trạm biến áp cho khu dịch vụ, chiếu sáng và khu kỹ thuật",
    "5 trạm BTS phủ sóng toàn bộ khu vực",
    "Hạ tầng mạng quang thụ động GPON tốc độ Gigabit",
];

type ShinecHomeProps = {
    articles?: API.ArticleListItem[];
}

const partnerLogos: string[] = [
  "Nông nghiệp công nghệ cao",
  "Chế biến thực phẩm",
  "Vật liệu xanh",
  "Logistics thông minh",
  "Năng lượng tái tạo",
  "Cơ khí phụ trợ",
];

const ShinecHome: React.FC<ShinecHomeProps> = ({ articles }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [heroSlides, setHeroSlides] = useState<AlbumPhoto[]>([]);
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const photos = await apiGetAlbumPhotos();
                setHeroSlides(photos.data);
            } catch (error) {
                console.error("Lỗi khi tải ảnh cho hero slider:", error);
            }
        };

        fetchSlides();
    }, []);

    const openContactForm = () => {
        const formAnchor = document.getElementById("contact-form-anchor");
        if (!formAnchor) {
            window.location.hash = "lien-he";
            return;
        }

        formAnchor.scrollIntoView({ behavior: "smooth", block: "start" });

        window.setTimeout(() => {
            const firstInput = formAnchor.querySelector<HTMLInputElement>("input, textarea");
            firstInput?.focus();
        }, 350);
    };

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % heroSlides.length);
        }, 4200);

        return () => window.clearInterval(timer);
    }, []);

    const showPrevSlide = () => {
        setSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const showNextSlide = () => {
        setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    };

    const landUse: LandUseItem[] = [
        { label: "Đất kho xưởng", value: "50,96 Ha" },
        { label: "Đất cây xanh", value: "9,74 Ha" },
        { label: "Đất dịch vụ", value: "3,65 Ha" },
        { label: "Đất giao thông nội bộ", value: "8,78 Ha" },
        { label: "Đất kỹ thuật", value: "1,67 Ha" },
    ];

    function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
        return (
            <div className="section-header">
                <p className="eyebrow">{eyebrow}</p>
                <h2>{title}</h2>
            </div>
        );
    }

    const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onChange = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  function validate(values: ContactFormValues): string | null {
  if (!values.name.trim() || !values.email.trim()) {
    return "Vui lòng nhập Họ tên và Email.";
  }

  if (values.name.length > 100 || values.email.length > 100) {
    return "Họ tên và Email tối đa 100 ký tự.";
  }

  if (values.phoneNumber.length > 20) {
    return "Số điện thoại tối đa 20 ký tự.";
  }

  if (values.address.length > 200) {
    return "Địa chỉ tối đa 200 ký tự.";
  }

  if (values.note.length > 500) {
    return "Nội dung tối đa 500 ký tự.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) {
    return "Email không đúng định dạng.";
  }

  return null;
}

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await apiContactSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim() || undefined,
        address: values.address.trim() || undefined,
        note: values.note.trim() || undefined,
      });

      setValues(initialValues);
      setSuccessMessage("Đã gửi thông tin thành công. Chúng tôi sẽ liên hệ sớm nhất.");
    } catch (requestError) {
      setError("Không thể gửi thông tin lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
        <>
            <section
                id="hero"
                className="relative overflow-hidden border-b border-[var(--line)] pt-28 pb-16 sm:pt-32"
                data-animate="reveal"
            >
                <div className="hero-aura pointer-events-none" />
                <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div className="space-y-6 animate-rise">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                            Cụm công nghiệp sinh thái định hướng ESG
                        </span>
                        <h1 className="text-balance text-3xl font-black leading-tight text-[var(--primary-deep)] sm:text-4xl lg:text-5xl">
                            Cụm công nghiệp số 2 Đak Đoa
                            <br />
                            Công ty Cổ phần Shinec Gia Lai
                        </h1>
                        <p className="max-w-xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                            Mô hình cụm công nghiệp phát triển theo định hướng ESG, gắn liền với hình ảnh cụm công nghiệp sinh thái,
                            chuỗi kinh tế tuần hoàn và thân thiện với môi trường.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={openContactForm}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-mid)]"
                            >
                                Nhận tư vấn đầu tư
                            </button>
                            <a
                                href="#loi-the"
                                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 text-sm font-bold text-[var(--primary-deep)] transition-transform duration-300 hover:-translate-y-0.5"
                            >
                                Khám phá lợi thế
                            </a>
                        </div>
                    </div>

                    <aside className="glass-card animate-float">
                        <div className="hero-slider mb-4" data-animate="reveal">
                            <div
                                className="hero-slider-track"
                                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                            >
                                {heroSlides.map((slide, index) => (
                                    <div className="hero-slide" key={index}>
                                        <img
                                            src={slide.url}
                                            alt={"IMAGE"}
                                            width={1200}
                                            height={760}
                                            className="h-44 w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="hero-slider-control left-2"
                                aria-label="Anh truoc"
                                onClick={showPrevSlide}
                            >
                            </button>
                            <button
                                type="button"
                                className="hero-slider-control right-2"
                                aria-label="Anh tiep theo"
                                onClick={showNextSlide}
                            >
                            </button>

                            <div className="hero-slider-dots">
                                {heroSlides.map((slide, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`hero-slider-dot ${index === slideIndex ? "hero-slider-dot-active" : ""}`}
                                        onClick={() => setSlideIndex(index)}
                                        aria-label={`Chon anh ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <h2 className="text-lg font-extrabold text-[var(--primary-deep)]">Thông tin nhanh</h2>
                        <ul className="mt-4 space-y-4 text-sm">
                            <li>
                                <p className="font-semibold text-[var(--primary)]">
                                    <span className="inline-flex items-center gap-2">
                                        Vị trí
                                    </span>
                                </p>
                            </li>
                            <li>
                                <p className="font-semibold text-[var(--primary)]">Định hướng phát triển</p>
                                <p className="text-[var(--text-muted)]">Cụm công nghiệp sinh thái, chuỗi kinh tế tuần hoàn</p>
                            </li>
                            <li>
                                <p className="font-semibold text-[var(--primary)]">Trọng tâm kết nối</p>
                                <p className="text-[var(--text-muted)]">Hạ tầng đồng bộ, thu hút đầu tư linh hoạt</p>
                            </li>
                        </ul>
                    </aside>
                </div>
            </section>
            <section id="gioi-thieu" className="section-block" data-animate="reveal">
                <div className="section-header">
                    <p className="eyebrow">Giới thiệu tổng quan</p>
                    <h2>Quỹ đất được quy hoạch bài bản, ưu tiên phát triển bền vững</h2>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {landUse.map((item, index) => (
                        <article
                            key={item.label}
                            className="data-card"
                            style={{ animationDelay: `${index * 80}ms` }}
                            data-animate="reveal"
                        >
                            <p className="text-sm font-semibold text-[var(--primary)]">{item.label}</p>
                            <p className="mt-3 text-2xl font-black text-[var(--primary-deep)]">{item.value}</p>
                        </article>
                    ))}
                </div>
            </section>
            <section id="loi-the" className="section-block" data-animate="reveal">
                <SectionHeading
                    eyebrow="Lợi thế đầu tư"
                    title="Gia tăng hiệu quả đầu tư bằng hệ sinh thái hỗ trợ toàn diện"
                />
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {advantages.map((item, index) => (
                        <article
                            key={item}
                            className="feature-card"
                            style={{ animationDelay: `${index * 80}ms` }}
                            data-animate="reveal"
                        >
                            <span className="feature-index">0{index + 1}</span>
                            <p className="mt-4 text-base font-semibold text-[var(--primary-deep)]">{item}</p>
                        </article>
                    ))}
                </div>
            </section>
            <section id="ha-tang" className="section-block" data-animate="reveal">
                <SectionHeading eyebrow="Hạ tầng kỹ thuật" title="Hệ thống kỹ thuật đồng bộ và hiện đại" />
                <div className="mt-8 grid gap-3 lg:grid-cols-2">
                    {infrastructures.map((item, index) => (
                        <div
                            key={item}
                            className="infra-item"
                            style={{ animationDelay: `${index * 60}ms` }}
                            data-animate="reveal"
                        >
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                            <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">{item}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section id="doi-tac" className="section-block" data-animate="reveal">
                <SectionHeading eyebrow="Logo các công ty" title="Mạng lưới ngành nghề có thể kết nối trong cụm" />
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {partnerLogos.map((item) => (
                        <div key={item} className="logo-chip" data-animate="reveal">
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </section>
             <section id="ban-do" className="section-block pt-0" data-animate="reveal">
      <SectionHeading eyebrow="Vị trí thực tế" title="Bản đồ khu vực Cụm công nghiệp số 2 Đak Đoa" />
      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        Vị trí trung tâm kết nối tại huyện Đak Đoa
      </p>
      <div
        className="mt-6 overflow-hidden flex h-96 rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_40px_rgba(0,107,29,0.12)]"
        data-animate="reveal"
      >
        <iframe
          src={"https://www.google.com/maps?q=X%C3%A3%20T%C3%A2n%20B%C3%ACnh%2C%20huy%E1%BB%87n%20%C4%90ak%20%C4%90oa%2C%20Gia%20Lai&output=embed"}
          title="Bản đồ vị trí Cụm công nghiệp số 2 Đak Đoa"
          className="h-full flex-1"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <section id="lien-he" className="section-block pb-20" data-animate="reveal">
      <div className="contact-wrap" data-animate="reveal">
        <div className="space-y-3">
          <SectionHeading
            eyebrow="Liên hệ"
            title="Cùng xây dựng nền công nghiệp xanh tại Gia Lai"
          />
          <p className="text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Đội ngũ Shinec Gia Lai luôn sẵn sàng hỗ trợ doanh nghiệp khảo sát, tư vấn và kết nối đầu tư.
          </p>
          <a className="contact-item" href={`mailto:congtyshinecgialai@gmail.com`}>
            Email: congtyshinecgialai@gmail.com
          </a>
          <a className="contact-item" href={`tel:02696333456`}>
            SĐT: 02696333456
          </a>
          <a
            className="contact-item"
            href={"https://www.facebook.com/shinecgialai"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook: facebook.com/shinecgialai
          </a>
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)] hover:underline"
          >
            Truy cập trang liên hệ chi tiết
          </Link>
        </div>

        <div className="grid gap-4 text-sm sm:text-base">

          <div id="contact-form-anchor">
            <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_10px_28px_rgba(0,107,29,0.08)] sm:p-5">
      <h3 className="text-base font-extrabold text-[var(--primary-deep)] sm:text-lg">Gửi thông tin tư vấn</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Vui lòng để lại thông tin, đội ngũ Shinec Gia Lai sẽ phản hồi sớm.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Họ và tên *
          <input
            type="text"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="Nguyễn Văn A"
            maxLength={100}
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Email *
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="example@company.com"
            maxLength={100}
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Số điện thoại
          <input
            type="text"
            value={values.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="0900 000 000"
            maxLength={20}
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Địa chỉ
          <input
            type="text"
            value={values.address}
            onChange={(event) => onChange("address", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="Gia Lai"
            maxLength={200}
          />
        </label>
      </div>

      <label className="mt-3 grid gap-1 text-sm text-[var(--text-strong)]">
        Nội dung liên hệ
        <textarea
          value={values.note}
          onChange={(event) => onChange("note", event.target.value)}
          className="min-h-28 rounded-xl border border-[var(--line)] px-3 py-2 outline-none transition focus:border-[var(--primary)]"
          placeholder="Nhu cầu đầu tư, ngành nghề quan tâm, thời gian khảo sát..."
          maxLength={500}
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {successMessage && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--primary)] px-5 text-sm font-bold text-white transition hover:bg-[var(--primary-mid)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>
    </form>
          </div>
        </div>
      </div>
    </section>
    </section>
            <section className="container mx-auto mb-4 md:mb-8" data-animate="reveal">
                <SectionHeading eyebrow="Tin tức & Sự kiện" title="Thông tin mới nhất về chúng tôi" />
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-4">
                    {articles?.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="h-48 bg-cover bg-center">
                                <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Featured</p>
                                <Link key={item.id} href={`/article/${item.normalizedName}`}>
                                    <h3 className="mt-1 text-lg line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default ShinecHome;