"use client";

import { CheckOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { AddToCartInput, useCartContext } from "@/contexts/cart-context";
import { useEffect, useRef, useState } from "react";

interface AddToCartButtonProps {
    item: AddToCartInput;
    className?: string;
    label?: string;
    addedLabel?: string;
}

const defaultClassName = "rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700";

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    item,
    className,
    label = "Thêm vào giỏ",
    addedLabel = "Đã thêm",
}) => {
    const { addToCart } = useCartContext();
    const [added, setAdded] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleClick = () => {
        addToCart(item);
        setAdded(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setAdded(false);
        }, 1400);
    };

    return (
        <button type="button" onClick={handleClick} className={className ?? defaultClassName}>
            <span className="flex items-center justify-center gap-2">
                {added ? <CheckOutlined /> : <ShoppingCartOutlined />}
                {added ? addedLabel : label}
            </span>
        </button>
    );
};

export default AddToCartButton;
