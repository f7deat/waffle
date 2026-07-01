import { FacebookFilled, LinkedinOutlined, PhoneOutlined, SendOutlined, TwitterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

export function ShinecFooter() {
  return (
    <footer className="bg-black bg-cover bg-center" style={{
      backgroundImage: 'url(https://wordpress.zozothemes.com/garland/wp-content/uploads/sites/15/2023/11/footer-bg-1-1.jpg)'
    }}>
      <div className="border-b border-gray-700">
        <div className="mx-auto container py-10">
          <div className="flex gap-4">
            <div className="text-white text-4xl 2xl:text-5xl flex-1 font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', lineHeight: '1.2' }}>
              Mô hình cụm công nghiệp phát triển theo định hướng ESG
            </div>
            <div className="flex-1 font-bold flex items-center flex-col gap-4">
              <div className="text-2xl text-white">
                <span className="text-green-700"><PhoneOutlined /></span> +(84) 269-633-3456
              </div>
              <Link href="/contact" className="px-10 block py-3 bg-[#2a7d2e] hover:text-white text-white rounded hover:bg-green-600 transition-colors">
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
              <h3 className="text-lg font-bold text-white mb-4">Về chúng tôi</h3>
              <p className="text-gray-400 mb-4">Shinec Gia Lai là một công ty hàng đầu trong lĩnh vực phát triển cụm công nghiệp theo định hướng ESG, cam kết mang lại giá trị bền vững cho cộng đồng và môi trường.</p>
              <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white text-2xl"><FacebookFilled /></a>
                  <a href="#" className="text-gray-400 hover:text-white text-2xl"><TwitterOutlined /></a>
                  <a href="#" className="text-gray-400 hover:text-white text-2xl"><LinkedinOutlined /></a>
              </div>
          </div>
          <div>
              <h3 className="text-lg font-bold text-white mb-4">Liên hệ</h3>
              <p className="text-gray-400">Địa chỉ: 14 Trần Hưng Đạo, Phường Tây Sơn, TP.Pleiku, Gia Lai</p>
              <p className="text-gray-400">Email: congtyshinecgialai@gmail.com</p>
              <p className="text-gray-400">Điện thoại: +(84) 269-633-3456</p>
          </div>
          <div>
              <h3 className="text-lg font-bold text-white mb-4">Theo dõi chúng tôi</h3>
              <div className="mt-4">
                  <p className="text-gray-400">Đăng ký nhận bản tin của chúng tôi để cập nhật những tin tức mới nhất.</p>
                  <form className="mt-2 flex">
                      <input type="email" placeholder="Nhập email của bạn" className="w-full px-4 py-3 2xl:py-4 rounded-l-full bg-transparent border border-gray-500 text-white focus:outline-none" />
                      <button type="submit" className="px-8 py-3 2xl:py-4 bg-[#2a7d2e] hover:bg-green-600 text-white rounded-r-full transition-colors">
                        <SendOutlined />
                      </button>
                  </form>
                  </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full border-t border-gray-700 px-4 py-4 text-center text-sm sm:px-6 text-slate-400">
        <p>Copyright © {dayjs().year()} <Link href="/" className="text-green-700">Shinec Gia Lai</Link>. All rights reserved.</p>
      </div>
    </footer>
  );
}
