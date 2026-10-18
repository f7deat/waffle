"use client";

import { apiContactSubmit } from "@/services/contact";
import { faEnvelope, faExclamationTriangle, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form } from "antd";
import { useState } from "react";

const COLLABORATION_TYPES = [
    "Trải nghiệm & Review quán ăn / cafe mới",
    "Quay video TikTok Review chuyên sâu",
    "Ghim bài & Vị trí lên Bản đồ độc quyền",
    "Chụp bộ ảnh Lookbook không gian & món",
    "Hợp tác dài hạn / Đại sứ thương hiệu"
];

const ContactForm: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values: {
        name: string;
        collaborationType: string;
        phoneNumber: string;
        email: string;
        message: string;
    }) => {
        try {
            setLoading(true);
            setSuccessMessage('');
            setErrorMessage('');
            const response = await apiContactSubmit({
                name: values.name,
                phoneNumber: values.phoneNumber,
                email: values.email,
                note: `Hình thức hợp tác: ${values.collaborationType}\nNội dung tóm tắt & Thời gian dự kiến: ${values.message}`
            });
            if (!response.succeeded) {
                setErrorMessage(response.message || 'Gửi yêu cầu hợp tác thất bại. Vui lòng thử lại.');
            } else {
                setSuccessMessage('Yêu cầu hợp tác đã gửi thành công!');
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4" id="booking-section">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                        <span className="text-sm">
                            <FontAwesomeIcon icon={faMessage} />
                        </span>
                    </span>
                    <div>
                        <h3 className="font-title text-title text-on-surface font-semibold">Gửi yêu cầu hợp tác nhanh</h3>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Phản hồi trong vòng 12-24 giờ làm việc</p>
                    </div>
                </div>
                <Form className="mt-1" id="bookingForm" onFinish={onFinish} layout="vertical">
                    <Form.Item name="name" label="Tên đơn vị / Thương hiệu" rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị / thương hiệu' }]}>
                        <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="Ví dụ: Cà phê Phố Cổ, Quán ăn Bà Ba..." />
                    </Form.Item>
                    <Form.Item name="collaborationType" label="Hình thức hợp tác" rules={[{ required: true, message: 'Vui lòng chọn hình thức hợp tác' }]}>
                        <select className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0">
                            {COLLABORATION_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-2">
                        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                            <input className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="09xx..." />
                        </Form.Item>
                        <Form.Item name="email" label="Email liên hệ" rules={[{ required: true, message: 'Vui lòng nhập email liên hệ' }]}>
                            <input className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="contact@..." type="email" />
                        </Form.Item>
                    </div>
                    <Form.Item name="message" label="Nội dung tóm tắt &amp; Thời gian dự kiến" rules={[{ required: true, message: 'Vui lòng nhập nội dung tóm tắt & thời gian dự kiến' }]}>
                        <textarea className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0 resize-none" placeholder="Ghi chú về địa điểm, địa chỉ, món đặc trưng và thời gian bạn muốn triển khai..." rows={3}></textarea>
                    </Form.Item>
                    <Button htmlType="submit" loading={loading} icon={<FontAwesomeIcon icon={faEnvelope} />} size="large"
                    className="w-full mt-1 h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary transition-all flex items-center justify-center gap-2">
                        Gửi lời mời hợp tác
                    </Button>
                    <p className="font-body-sm text-[11px] text-center text-on-surface-variant mt-2">
                        Hoặc liên hệ Quản lý: <span className="font-semibold text-secondary">defzone.net@gmail.com</span> (0762.559.696)
                    </p>
                </Form>
                {successMessage && <p className="text-success font-body-sm text-[12px] mt-2">{successMessage}</p>}
                {errorMessage && <div className="bg-red-100 text-red-700 p-2 rounded-lg"><FontAwesomeIcon icon={faExclamationTriangle} /> {errorMessage}</div>}
            </div>
        </>
    )
}

export default ContactForm;