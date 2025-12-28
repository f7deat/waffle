import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto container px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Privacy</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Chính sách bảo mật</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Cập nhật lần cuối: 28/12/2025</p>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Tài liệu này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân khi bạn sử dụng dịch vụ.
          </p>
        </header>

        <div className="space-y-6">
          {/* Thông tin thu thập */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Thông tin chúng tôi thu thập</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Thông tin tài khoản: tên, email, ảnh hồ sơ.</li>
              <li>Thông tin giao dịch: lịch sử mua hàng, trạng thái đơn hàng.</li>
              <li>Dữ liệu kỹ thuật: cookie, địa chỉ IP, loại trình duyệt, trang đã xem.</li>
              <li>Phản hồi và hỗ trợ: nội dung bạn gửi qua biểu mẫu liên hệ.</li>
            </ul>
          </section>

          {/* Cách sử dụng */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Cách chúng tôi sử dụng thông tin</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Cung cấp và cải thiện sản phẩm/dịch vụ.</li>
              <li>Cá nhân hoá trải nghiệm và đề xuất nội dung phù hợp.</li>
              <li>Xử lý thanh toán, vận hành đơn hàng và hỗ trợ khách hàng.</li>
              <li>Phân tích, ngăn chặn gian lận và đảm bảo an toàn hệ thống.</li>
            </ul>
          </section>

          {/* Cookie */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Cookie và công nghệ tương tự</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi sử dụng cookie để ghi nhớ tuỳ chọn, đo lường hiệu suất và cá nhân hoá nội dung. Bạn có thể quản lý cookie trong cài đặt trình duyệt.
            </p>
          </section>

          {/* Chia sẻ dữ liệu */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Chia sẻ dữ liệu</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi chỉ chia sẻ dữ liệu với các đối tác xử lý thanh toán, phân tích, hoặc dịch vụ cần thiết để vận hành hệ thống — theo hợp đồng bảo mật và tuân thủ pháp luật. Chúng tôi không bán thông tin cá nhân.
            </p>
          </section>

          {/* Bảo mật */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bảo mật dữ liệu</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để bảo vệ dữ liệu của bạn. Tuy nhiên, không hệ thống nào an toàn tuyệt đối. Vui lòng liên hệ nếu bạn nghi ngờ tài khoản bị xâm nhập.
            </p>
          </section>

          {/* Quyền của bạn */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quyền của bạn</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Truy cập, cập nhật hoặc xoá dữ liệu cá nhân.</li>
              <li>Yêu cầu giải thích về cách xử lý dữ liệu.</li>
              <li>Rút lại sự đồng ý (nếu áp dụng) và từ chối tiếp thị.</li>
              <li>Gửi khiếu nại đến cơ quan có thẩm quyền.</li>
            </ul>
          </section>

          {/* Liên hệ */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Liên hệ</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua trang <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Liên hệ</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
