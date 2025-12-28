import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto container px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Terms</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Điều khoản sử dụng</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Cập nhật lần cuối: 28/12/2025</p>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            Bằng việc truy cập hoặc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau đây. Vui lòng đọc kỹ trước khi tiếp tục sử dụng.
          </p>
        </header>

        <div className="space-y-6">
          {/* Chấp nhận điều khoản */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Chấp nhận điều khoản</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Khi sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </section>

          {/* Tài khoản */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tài khoản và bảo mật</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập.</li>
              <li>Bạn chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình.</li>
              <li>Thông báo cho chúng tôi ngay nếu phát hiện truy cập trái phép hoặc vi phạm bảo mật.</li>
            </ul>
          </section>

          {/* Sử dụng dịch vụ */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sử dụng dịch vụ</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp, gây hại hoặc xâm phạm quyền của người khác.</li>
              <li>Không can thiệp, phá hoại, khai thác lỗ hổng hoặc vượt qua các biện pháp bảo mật.</li>
              <li>Tuân thủ luật pháp hiện hành và các chính sách của chúng tôi.</li>
            </ul>
          </section>

          {/* Mua hàng và thanh toán */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Mua hàng và thanh toán</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Giá cả, khuyến mãi và tính sẵn có có thể thay đổi. Giao dịch được xử lý qua đối tác thanh toán an toàn. Chính sách hoàn tiền (nếu có) sẽ được mô tả tại trang sản phẩm.
            </p>
          </section>

          {/* Nội dung và quyền sở hữu trí tuệ */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Nội dung và quyền sở hữu trí tuệ</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Mọi nội dung, nhãn hiệu và tài liệu thuộc quyền sở hữu của chúng tôi hoặc đối tác.</li>
              <li>Khi gửi nội dung, bạn cấp cho chúng tôi quyền sử dụng để vận hành dịch vụ.</li>
              <li>Nếu bạn tin rằng có vi phạm bản quyền, vui lòng liên hệ qua trang <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Liên hệ</Link>.</li>
            </ul>
          </section>

          {/* Liên kết bên thứ ba */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Dịch vụ và liên kết bên thứ ba</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi có thể liên kết đến dịch vụ của bên thứ ba. Chúng tôi không chịu trách nhiệm cho nội dung, chính sách hoặc thực tiễn của họ.
            </p>
          </section>

          {/* Chấm dứt */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Chấm dứt sử dụng</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập của bạn nếu phát hiện hành vi vi phạm điều khoản hoặc gây rủi ro cho hệ thống/người dùng.
            </p>
          </section>

          {/* Tuyên bố miễn trừ */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tuyên bố miễn trừ trách nhiệm</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Dịch vụ cung cấp "như hiện có" và "theo sẵn có". Chúng tôi không đảm bảo dịch vụ không gián đoạn hoặc không lỗi.
            </p>
          </section>

          {/* Giới hạn trách nhiệm */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Giới hạn trách nhiệm</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp, phát sinh hoặc đặc biệt do việc sử dụng dịch vụ.
            </p>
          </section>

          {/* Thay đổi điều khoản */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Thay đổi điều khoản</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Chúng tôi có thể cập nhật điều khoản định kỳ. Tiếp tục sử dụng sau khi cập nhật đồng nghĩa bạn chấp nhận phiên bản mới.
            </p>
          </section>

          {/* Luật áp dụng */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Luật áp dụng</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Điều khoản này được điều chỉnh bởi luật pháp hiện hành tại khu vực hoạt động của chúng tôi.
            </p>
          </section>

          {/* Liên hệ */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Liên hệ</h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Nếu bạn có câu hỏi liên quan đến điều khoản sử dụng, vui lòng liên hệ qua trang <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Liên hệ</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
