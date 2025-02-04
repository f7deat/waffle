namespace Waffle.Data.ContentData;

public class LocaleData
{
    // Add your keys here
    public readonly static Dictionary<string, Dictionary<string, string>> Values = new() {
        {
            "login", new Dictionary<string, string>
            {
                { "en-US", "Login" },
                { "vi-VN", "Đăng nhập" },
                { "ko-KR", "로그인" },
                { "ja-JP", "ログイン" },
                { "zh-CN", "登录" }
            }
        },
        {
            "register", new Dictionary<string, string>
            {
                { "en-US", "Register" },
                { "vi-VN", "Đăng ký" },
                { "ko-KR", "레지스터" },
                { "ja-JP", "登録" },
                { "zh-CN", "寄存器" }
            }
        },
        {
            "home", new Dictionary<string, string>
            {
                { "en-US", "Home" },
                { "vi-VN", "Trang chủ" },
                { "ko-KR", "집" },
                { "ja-JP", "ホーム" },
                { "zh-CN", "家" }
            }
        },
        {
            "user_name", new Dictionary<string, string>
            {
                { "en-US", "Username" },
                { "vi-VN", "Tài khoản" },
                { "ko-KR", "사용자 이름" },
                { "ja-JP", "ユーザー名" },
                { "zh-CN", "用户名" }
            }
        },
        {
            "phone_number", new Dictionary<string, string>
            {
                { "en-US", "Phone number" },
                { "vi-VN", "Số điện thoại" },
                { "ko-KR", "전화 번호" },
                { "ja-JP", "電話番号" },
                { "zh-CN", "电话号码" }
            }
        },
        {
            "password", new Dictionary<string, string>
            {
                { "en-US", "Password" },
                { "vi-VN", "Mật khẩu" },
                { "ko-KR", "비밀번호" },
                { "ja-JP", "パスワード" },
                { "zh-CN", "密码" }
            }
        },
        {
            "remember_me", new Dictionary<string, string>
            {
                { "en-US", "Remember me" },
                { "vi-VN", "Nhớ mật khẩu" },
                { "ko-KR", "나를 기억해" },
                { "ja-JP", "私を覚えてますか" },
                { "zh-CN", "记住账号" }
            }
        }
    };
}
