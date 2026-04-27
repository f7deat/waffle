"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "cart_items";

export interface CartItem {
    productId: string;
    quantity: number;
    name?: string;
    thumbnail?: string;
    normalizedName?: string;
    price?: number;
    salePrice?: number;
}

export interface AddToCartInput {
    productId: string;
    quantity?: number;
    name?: string;
    thumbnail?: string;
    normalizedName?: string;
    price?: number;
    salePrice?: number;
}

interface CartState {
    items: CartItem[];
    hydrated: boolean;
    totalItems: number;
    totalUniqueItems: number;
    addToCart: (item: AddToCartInput) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartState | undefined>(undefined);

function readCartFromStorage(): CartItem[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as CartItem[];
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((item) => item && typeof item.productId === "string")
            .map((item) => ({
                ...item,
                quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
            }));
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setItems(readCartFromStorage());
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated || typeof window === "undefined") {
            return;
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const addToCart = useCallback((item: AddToCartInput) => {
        const nextQuantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

        setItems((currentItems) => {
            const itemIndex = currentItems.findIndex((cartItem) => cartItem.productId === item.productId);

            if (itemIndex === -1) {
                return [
                    ...currentItems,
                    {
                        ...item,
                        quantity: nextQuantity,
                    },
                ];
            }

            const updated = [...currentItems];
            updated[itemIndex] = {
                ...updated[itemIndex],
                ...item,
                quantity: updated[itemIndex].quantity + nextQuantity,
            };
            return updated;
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setItems((currentItems) => {
            if (quantity <= 0) {
                return currentItems.filter((item) => item.productId !== productId);
            }

            return currentItems.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity,
                    }
                    : item
            );
        });
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = useMemo(
        () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
        [items]
    );

    const value = useMemo<CartState>(
        () => ({
            items,
            hydrated,
            totalItems,
            totalUniqueItems: items.length,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
        }),
        [items, hydrated, totalItems, addToCart, updateQuantity, removeFromCart, clearCart]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartState {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used inside <CartProvider>");
    }
    return context;
}
