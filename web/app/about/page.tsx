import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRight,
	faBookOpen,
	faCompass,
	faLocationDot,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
	title: "Về DefZone | Khám phá điều hay quanh bạn",
	description:
		"DefZone giúp bạn tìm địa điểm thú vị, đọc những câu chuyện đáng nhớ và lên kế hoạch cho trải nghiệm tiếp theo.",
};

const destinations = [
	{
		number: "01",
		title: "Tìm nơi đáng đến",
		description:
			"Từ quán quen trong phố đến điểm dừng chân mới, khám phá những địa điểm hợp với tâm trạng và kế hoạch của bạn.",
		href: "/place",
		linkLabel: "Khám phá địa điểm",
		icon: faLocationDot,
		tone: "bg-[#d9eddf] text-[#22583a]",
	},
	{
		number: "02",
		title: "Đọc trước khi đi",
		description:
			"Những bài viết, gợi ý và góc nhìn thực tế giúp bạn biết thêm về nơi mình sắp ghé thăm.",
		href: "/article",
		linkLabel: "Đọc bài viết",
		icon: faBookOpen,
		tone: "bg-[#f8e3c5] text-[#8c4b1c]",
	},
	{
		number: "03",
		title: "Theo dấu người truyền cảm hứng",
		description:
			"Gặp gỡ những nhà sáng tạo nội dung và tìm thêm cảm hứng cho hành trình của riêng bạn.",
		href: "/influencer",
		linkLabel: "Gặp gỡ nhà sáng tạo",
		icon: faUsers,
		tone: "bg-[#dce8f8] text-[#315c91]",
	},
];

export default function AboutPage() {
	return (
		<main className="overflow-hidden bg-[#f7f7f2] text-[#202a24]">
			<section className="relative isolate min-h-[560px] overflow-hidden bg-[#26392e] text-white sm:min-h-[640px]">
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-20 bg-cover bg-center"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=85')",
					}}
				/>
				<div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#17241d]/55" />
				<div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-between px-5 pb-10 pt-8 sm:min-h-[640px] sm:px-10 sm:pb-14 sm:pt-12 lg:px-16">
					<nav aria-label="Đường dẫn" className="flex items-center gap-2 text-sm text-white/75">
						<Link href="/" className="transition hover:text-white">Trang chủ</Link>
						<span aria-hidden="true">/</span>
						<span className="text-white">Về DefZone</span>
					</nav>

					<div className="max-w-4xl pb-8 sm:pb-12">
						<p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c9e1a3] sm:text-sm">
							<span className="h-px w-9 bg-[#c9e1a3]" />
							Một góc nhìn khác về những nơi ta đi qua
						</p>
						<h1 className="max-w-4xl text-5xl font-bold leading-[1.06] sm:text-7xl lg:text-8xl">
							Thành phố rộng,
							<br />
							<span className="font-medium text-[#d6e5c5]">đi đâu cũng có chuyện hay.</span>
						</h1>
						<div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
							<p className="max-w-xl text-base leading-7 text-white/80 sm:text-lg">
								DefZone gom góp địa điểm, câu chuyện và cảm hứng để mỗi lần bạn bước ra ngoài đều bắt đầu bằng một lựa chọn thú vị.
							</p>
							<Link
								href="/place"
								className="inline-flex w-fit shrink-0 items-center gap-3 border-b border-[#c9e1a3] pb-2 text-sm font-semibold text-white transition hover:gap-5"
							>
								Bắt đầu khám phá
								<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
							</Link>
						</div>
					</div>
				</div>
				<span className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[0.18em] text-white/60 sm:bottom-8 sm:right-10">
					Thành phố luôn có điều mới
				</span>
			</section>

			<section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-16">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7c49]">Chúng tôi tin rằng</p>
					<h2 className="mt-4 max-w-md text-3xl font-bold leading-tight sm:text-5xl">
						Một nơi hay có thể làm nên cả một ngày vui.
					</h2>
				</div>
				<div className="max-w-2xl self-end">
					<p className="text-lg leading-8 text-[#48534a]">
						Có khi đó là một quán nhỏ được bạn bè truyền tai, một con đường lần đầu rẽ vào, hay một câu chuyện khiến ta muốn xách túi lên và đi. DefZone được tạo ra để những gợi ý như thế dễ tìm thấy nhau hơn.
					</p>
					<p className="mt-5 leading-7 text-[#687168]">
						Chúng tôi kết nối thông tin về địa điểm với bài viết và cộng đồng sáng tạo, để bạn có thêm góc nhìn trước khi lên đường — và thêm lý do để kể lại sau chuyến đi.
					</p>
				</div>
			</section>

			<section className="border-y border-[#e2e5dc] bg-white">
				<div className="mx-auto grid max-w-7xl lg:grid-cols-2">
					<div className="relative min-h-[340px] overflow-hidden bg-[#d7dfd2] sm:min-h-[460px]">
						<div
							role="img"
							aria-label="Không gian ấm cúng của một điểm hẹn trong thành phố"
							className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.03]"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85')",
							}}
						/>
						<div className="absolute bottom-5 left-5 bg-[#f7f7f2] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#435743] sm:bottom-8 sm:left-8">
							Điểm hẹn tiếp theo đang chờ
						</div>
					</div>
					<div className="flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
						<div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#d9eddf] text-[#22583a]">
							<FontAwesomeIcon icon={faCompass} className="text-lg" aria-hidden="true" />
						</div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7c49]">Từ tò mò đến trải nghiệm</p>
						<h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
							Không chỉ là nơi để xem. Là nơi để bắt đầu đi.
						</h2>
						<p className="mt-5 max-w-lg leading-7 text-[#687168]">
							Một gợi ý đúng lúc có thể biến buổi chiều bình thường thành cuộc hẹn đáng nhớ. Chúng tôi muốn việc tìm cảm hứng trở nên gần gũi, hữu ích và dành cho mọi kiểu khám phá.
						</p>
						<Link href="/article" className="mt-7 inline-flex w-fit items-center gap-3 text-sm font-bold text-[#315d3b] transition hover:gap-5">
							Đọc những câu chuyện mới
							<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
				<div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d7c49]">Khám phá theo cách của bạn</p>
						<h2 className="mt-3 text-3xl font-bold sm:text-5xl">Mỗi hành trình, một điểm bắt đầu.</h2>
					</div>
					<p className="max-w-sm text-sm leading-6 text-[#687168]">
						Chọn một điều đang khiến bạn tò mò. Phần còn lại cứ để chuyến đi trả lời.
					</p>
				</div>
				<div className="grid border-t border-[#dfe3da] md:grid-cols-3 md:divide-x md:divide-[#dfe3da]">
					{destinations.map((item) => (
						<article key={item.number} className="flex min-h-[300px] flex-col border-b border-[#dfe3da] py-7 md:border-b-0 md:px-7 md:py-8 first:md:pl-0 last:md:pr-0">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold tracking-[0.15em] text-[#8a9388]">{item.number}</span>
								<span className={`flex h-11 w-11 items-center justify-center rounded-full ${item.tone}`}>
									<FontAwesomeIcon icon={item.icon} aria-hidden="true" />
								</span>
							</div>
							<h3 className="mt-8 text-xl font-bold">{item.title}</h3>
							<p className="mt-3 flex-1 text-sm leading-6 text-[#687168]">{item.description}</p>
							<Link href={item.href} className="mt-6 inline-flex w-fit items-center gap-3 text-sm font-bold text-[#315d3b] transition hover:gap-5">
								{item.linkLabel}
								<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
							</Link>
						</article>
					))}
				</div>
			</section>

			<section className="bg-[#d9eddf] px-5 py-14 sm:px-10 sm:py-16 lg:px-16">
				<div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
					<div className="max-w-2xl">
						<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#456b4b]">Cùng góp một gợi ý hay</p>
						<h2 className="mt-3 text-3xl font-bold leading-tight text-[#203c2a] sm:text-4xl">Bạn biết một nơi mọi người nên thử?</h2>
						<p className="mt-3 max-w-xl leading-7 text-[#45614a]">Chia sẻ câu chuyện, góp ý hoặc kết nối với đội ngũ DefZone. Chúng tôi luôn muốn nghe thêm góc nhìn từ bạn.</p>
					</div>
					<Link href="/contact" className="inline-flex w-fit shrink-0 items-center gap-3 bg-[#263f2e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#365b40]">
						Liên hệ với chúng tôi
						<FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
					</Link>
				</div>
			</section>
		</main>
	);
}
