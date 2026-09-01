import { ConfigProvider } from "antd";
import { CartProvider } from "@/contexts/cart-context";
import Footer from "./footer";
import Header from "./header";

export default function AppShell({ children }: { children: React.ReactNode }) {

    return (
        <ConfigProvider theme={{
            token: {
                fontFamily: "quicksand, sans-serif",
            },
        }}>
            <CartProvider>
                <div className="min-h-screen bg-slate-100">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </CartProvider>
        </ConfigProvider>
    );
}