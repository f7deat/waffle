export type LandUseItem = {
  label: string;
  value: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  image: string;
  content: string[];
};

export const siteInfo = {
  name: "Cụm công nghiệp số 2 Đak Đoa",
  company: "Công ty Cổ phần Shinec Gia Lai",
  location: "Xã Tân Bình, huyện Đak Đoa, tỉnh Gia Lai",
  email: "congtyshinecgialai@gmail.com",
  phone: "02696333456",
  facebook: "https://www.facebook.com/shinecgialai/",
  mapEmbedUrl:
    "https://www.google.com/maps?q=X%C3%A3%20T%C3%A2n%20B%C3%ACnh%2C%20huy%E1%BB%87n%20%C4%90ak%20%C4%90oa%2C%20Gia%20Lai&output=embed",
};

export const landUse: LandUseItem[] = [
  { label: "Đất kho xưởng", value: "50,96 Ha" },
  { label: "Đất cây xanh", value: "9,74 Ha" },
  { label: "Đất dịch vụ", value: "3,65 Ha" },
  { label: "Đất giao thông nội bộ", value: "8,78 Ha" },
  { label: "Đất kỹ thuật", value: "1,67 Ha" },
];

export const advantages: string[] = [
  "Tối ưu chi phí đầu tư xây dựng",
  "Thủ tục pháp lý đầu tư minh bạch",
  "Tuyển dụng hiệu quả",
  "Mô hình cụm công nghiệp sinh thái",
  "Linh hoạt trong thu hút đầu tư",
  "Đội ngũ nhân viên tận tâm, hỗ trợ và kết nối",
];

export const infrastructures: string[] = [
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

export const partnerLogos: string[] = [
  "Nông nghiệp công nghệ cao",
  "Chế biến thực phẩm",
  "Vật liệu xanh",
  "Logistics thông minh",
  "Năng lượng tái tạo",
  "Cơ khí phụ trợ",
];

export const galleryImages = [
  { src: "/images/gallery-01.svg", alt: "Tổng thể khu kho xưởng hiện đại" },
  { src: "/images/gallery-02.svg", alt: "Không gian cảnh quan xanh trong cụm" },
  { src: "/images/gallery-03.svg", alt: "Khu điều hành và kết nối doanh nghiệp" },
  { src: "/images/gallery-04.svg", alt: "Hạ tầng công nghiệp đồng bộ" },
  { src: "/images/gallery-05.svg", alt: "Mô hình kinh tế tuần hoàn ESG" },
  { src: "/images/gallery-06.svg", alt: "Bản đồ định vị khu công nghiệp" },
];

export const newsItems: NewsItem[] = [
  {
    slug: "dinh-huong-esg-trong-van-hanh-cum-cong-nghiep",
    title: "Định hướng ESG trong vận hành cụm công nghiệp",
    excerpt:
      "Tập trung giảm phát thải, nâng cao hiệu quả năng lượng và xây dựng môi trường sản xuất bền vững cho doanh nghiệp.",
    category: "ESG",
    publishedAt: "2026-04-10",
    image: "/images/news-esg.svg",
    content: [
      "Shinec Gia Lai định hướng triển khai mô hình quản trị ESG ngay từ giai đoạn vận hành hạ tầng, với trọng tâm là tối ưu năng lượng, giảm phát sinh chất thải và tăng tỷ lệ tái sử dụng tài nguyên.",
      "Nhà đầu tư thứ cấp được khuyến khích ứng dụng công nghệ tiết kiệm tài nguyên, xây dựng hệ thống theo dõi phát thải và đồng bộ hóa quy trình môi trường theo chuẩn khu công nghiệp sinh thái.",
      "Định hướng này giúp doanh nghiệp tăng khả năng cạnh tranh dài hạn, đồng thời đáp ứng kỳ vọng ngày càng cao về phát triển bền vững trong chuỗi cung ứng toàn cầu.",
    ],
  },
  {
    slug: "day-manh-lien-ket-chuoi-kinh-te-tuan-hoan",
    title: "Đẩy mạnh liên kết chuỗi kinh tế tuần hoàn",
    excerpt:
      "Mô hình cộng sinh công nghiệp giúp tối ưu tài nguyên, giảm chi phí vận hành và gia tăng giá trị dài hạn.",
    category: "Kinh tế tuần hoàn",
    publishedAt: "2026-04-18",
    image: "/images/news-circular.svg",
    content: [
      "Tại cụm công nghiệp số 2 Đak Đoa, các nhóm ngành được định hướng kết nối theo chuỗi để gia tăng giá trị sử dụng của nguyên liệu, phụ phẩm và dịch vụ phụ trợ.",
      "Mô hình cộng sinh công nghiệp góp phần giảm lượng chất thải đầu ra, đồng thời tạo thêm cơ hội hợp tác giữa các doanh nghiệp trong cùng khu vực.",
      "Cách tiếp cận tuần hoàn tạo lợi thế về chi phí và tính ổn định trong vận hành, giúp nhà đầu tư chủ động hơn trước biến động thị trường nguyên vật liệu.",
    ],
  },
  {
    slug: "ha-tang-dong-bo-san-sang-don-nha-dau-tu",
    title: "Hạ tầng đồng bộ sẵn sàng đón nhà đầu tư",
    excerpt:
      "Hệ thống điện, nước, giao thông nội bộ và viễn thông được triển khai toàn diện, đáp ứng nhanh tiến độ sản xuất.",
    category: "Hạ tầng",
    publishedAt: "2026-04-25",
    image: "/images/news-infra.svg",
    content: [
      "Hạ tầng kỹ thuật được đầu tư đồng bộ với mạng giao thông nội bộ, hệ thống cấp nước công nghiệp, viễn thông tốc độ cao và năng lực cấp điện ổn định cho từng phân khu.",
      "Bên cạnh đó, công tác vận hành được tổ chức theo hướng hỗ trợ nhanh, giúp doanh nghiệp rút ngắn thời gian chuẩn bị và sớm đưa dự án vào hoạt động.",
      "Đây là nền tảng quan trọng để cụm công nghiệp duy trì năng lực thu hút đầu tư linh hoạt, đồng thời đáp ứng yêu cầu mở rộng sản xuất trong dài hạn.",
    ],
  },
];

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Công ty Cổ phần Shinec Gia Lai",
  url: "https://www.facebook.com/shinecgialai/",
  email: "congtyshinecgialai@gmail.com",
  telephone: "02696333456",
  sameAs: ["https://www.facebook.com/shinecgialai/"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Xã Tân Bình, huyện Đak Đoa",
    addressRegion: "Gia Lai",
    addressCountry: "VN",
  },
};
