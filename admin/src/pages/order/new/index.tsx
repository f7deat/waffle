import { apiProductDetail, apiProductOptions } from "@/services/products/product";
import { placeOrder } from "@/services/order";
import { LeftOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { history } from "@umijs/max";
import { Button, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";

type ProductOption = {
    label: string;
    value: string;
}

const phoneRegex = /^(0|\+84)(\d{9,10})$/;

type OrderDetailForm = {
    productId?: string;
    quantity?: number;
    price?: number;
}

type NewOrderForm = {
    name: string;
    phoneNumber: string;
    address: string;
    note?: string;
    orderDetails: OrderDetailForm[];
}

const NewOrderPage: React.FC = () => {
    const [form] = Form.useForm<NewOrderForm>();
    const [submitting, setSubmitting] = useState(false);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const orderDetails = Form.useWatch("orderDetails", form) || [];

    useEffect(() => {
        apiProductOptions().then((response) => {
            setProductOptions(response || []);
        });
    }, []);

    const subtotal = useMemo(() => {
        return orderDetails.reduce((sum: number, item: OrderDetailForm) => {
            const price = Number(item?.price || 0);
            const quantity = Number(item?.quantity || 0);
            return sum + (price * quantity);
        }, 0);
    }, [orderDetails]);

    const formatMoney = (value: number) => {
        return value.toLocaleString("vi-VN");
    }

    const handleSelectProduct = async (productId: string, index: number) => {
        const detail = await apiProductDetail(productId);
        const nextDetails = [...(form.getFieldValue("orderDetails") || [])];
        nextDetails[index] = {
            ...nextDetails[index],
            productId,
            price: Number(detail?.salePrice ?? detail?.price ?? 0),
        };
        form.setFieldValue("orderDetails", nextDetails);
    };

    const onFinish = async (values: NewOrderForm) => {
        if (!values.orderDetails || values.orderDetails.length === 0) {
            message.error("Vui lòng thêm ít nhất 1 sản phẩm.");
            return;
        }

        const hasInvalidLine = values.orderDetails.some((item) => {
            return !item.productId || Number(item.quantity || 0) <= 0 || Number(item.price || 0) <= 0;
        });

        if (hasInvalidLine) {
            message.error("Chi tiết đơn hàng không hợp lệ. Vui lòng kiểm tra lại sản phẩm, số lượng và đơn giá.");
            return;
        }

        if (!phoneRegex.test(values.phoneNumber.trim())) {
            message.error("Số điện thoại không đúng định dạng.");
            return;
        }

        const payload = {
            name: values.name.trim(),
            phoneNumber: values.phoneNumber.trim(),
            address: values.address.trim(),
            note: values.note?.trim(),
            orderDetails: values.orderDetails
                .filter((item) => item.productId)
                .map((item) => ({
                    productId: item.productId,
                    quantity: Number(item.quantity || 0),
                    price: Number(item.price || 0),
                })),
        };

        if (payload.orderDetails.length === 0) {
            message.error("Vui lòng chọn sản phẩm cho chi tiết đơn hàng.");
            return;
        }

        setSubmitting(true);
        try {
            await placeOrder(payload);
            message.success("Tạo đơn hàng thành công.");
            history.push("/shop/order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Quay lại</Button>} title="Tạo đơn hàng">
            <ProCard>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        orderDetails: [{ quantity: 1, price: 0 }],
                    }}
                >
                    <Row gutter={16}>
                        <Col md={12} xs={24}>
                            <Form.Item
                                label="Tên khách hàng"
                                name="name"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên khách hàng" },
                                    { max: 100, message: "Tên khách hàng tối đa 100 ký tự" },
                                ]}
                            >
                                <Input placeholder="Nhập tên khách hàng" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col md={12} xs={24}>
                            <Form.Item
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại" },
                                    { pattern: phoneRegex, message: "Số điện thoại không đúng định dạng (0xxxxxxxxx hoặc +84xxxxxxxxx)" },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" maxLength={12} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[
                                    { required: true, message: "Vui lòng nhập địa chỉ" },
                                    { max: 200, message: "Địa chỉ tối đa 200 ký tự" },
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ" maxLength={200} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item label="Ghi chú" name="note" rules={[{ max: 500, message: "Ghi chú tối đa 500 ký tự" }]}>
                                <Input.TextArea rows={3} placeholder="Ghi chú đơn hàng" maxLength={500} showCount />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Chi tiết đơn hàng</Divider>

                    <Form.List name="orderDetails">
                        {(fields, { add, remove }) => (
                            <div>
                                {fields.map((field, index) => {
                                    const line = orderDetails[index] || {};
                                    const lineTotal = Number(line.price || 0) * Number(line.quantity || 0);

                                    return (
                                        <ProCard key={field.key} className="mb-3" size="small">
                                            <Row gutter={16} align="middle">
                                                <Col md={9} xs={24}>
                                                    <Form.Item
                                                        {...field}
                                                        label="Sản phẩm"
                                                        name={[field.name, "productId"]}
                                                        rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            placeholder="Chọn sản phẩm"
                                                            options={productOptions}
                                                            filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                                                            onChange={(value) => handleSelectProduct(value, index)}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={5} xs={12}>
                                                    <Form.Item
                                                        {...field}
                                                        label="Số lượng"
                                                        name={[field.name, "quantity"]}
                                                        rules={[
                                                            { required: true, message: "Vui lòng nhập số lượng" },
                                                            {
                                                                validator: (_, value) => {
                                                                    if (Number(value) > 0) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(new Error("Số lượng phải lớn hơn 0"));
                                                                }
                                                            }
                                                        ]}
                                                    >
                                                        <InputNumber min={1} className="w-full" />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={5} xs={12}>
                                                    <Form.Item
                                                        {...field}
                                                        label="Đơn giá"
                                                        name={[field.name, "price"]}
                                                        rules={[
                                                            { required: true, message: "Vui lòng nhập đơn giá" },
                                                            {
                                                                validator: (_, value) => {
                                                                    if (Number(value) > 0) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(new Error("Đơn giá phải lớn hơn 0"));
                                                                }
                                                            }
                                                        ]}
                                                    >
                                                        <InputNumber min={1} className="w-full" />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={3} xs={12}>
                                                    <Typography.Text strong>Thành tiền</Typography.Text>
                                                    <div>{formatMoney(lineTotal)}</div>
                                                </Col>
                                                <Col md={2} xs={12}>
                                                    <Button danger onClick={() => remove(field.name)}>Xóa</Button>
                                                </Col>
                                            </Row>
                                        </ProCard>
                                    );
                                })}

                                <Button onClick={() => add({ quantity: 1, price: 1 })}>Thêm sản phẩm</Button>
                            </div>
                        )}
                    </Form.List>

                    <Divider />

                    <Row justify="end" className="mb-4">
                        <Col>
                            <Typography.Title level={5} className="!mb-0">
                                Tạm tính: {formatMoney(subtotal)}
                            </Typography.Title>
                        </Col>
                    </Row>

                    <Space>
                        <Button onClick={() => history.back()}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Tạo đơn hàng</Button>
                    </Space>
                </Form>
            </ProCard>
        </PageContainer>
    )
}

export default NewOrderPage;