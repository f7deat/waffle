"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

type ProductTabsProps = {
    description?: string;
    content?: ReactNode;
    details: { label: string; value: string }[];
    tags: { id: string; name: string; normalizedName: string }[];
};

const ProductTabs = ({ description, content, details, tags }: ProductTabsProps) => {
    const [activeTab, setActiveTab] = useState<"description" | "details">("description");

    return (
        <section className="py-10">
            <div className="flex gap-6 overflow-x-auto border-b border-surface-variant/60">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "description"}
                    onClick={() => setActiveTab("description")}
                    className={`whitespace-nowrap border-b-2 px-1 pb-3 font-semibold ${
                        activeTab === "description" ? "border-primary text-primary" : "border-transparent text-on-surface-variant"
                    }`}
                >
                    Mô tả sản phẩm
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "details"}
                    onClick={() => setActiveTab("details")}
                    className={`whitespace-nowrap border-b-2 px-1 pb-3 font-semibold ${
                        activeTab === "details" ? "border-primary text-primary" : "border-transparent text-on-surface-variant"
                    }`}
                >
                    Thông tin chi tiết
                </button>
            </div>

            {activeTab === "description" ? (
                <div role="tabpanel" className="prose prose-neutral max-w-none py-8 text-on-surface-variant">
                    {content || (description ? <p>{description}</p> : <p>Thông tin mô tả đang được cập nhật.</p>)}
                </div>
            ) : (
                <div role="tabpanel" className="py-8">
                    <dl className="grid gap-x-10 md:grid-cols-2">
                        {details.map((detail) => (
                            <div key={detail.label} className="flex justify-between gap-4 border-b border-surface-variant/50 py-3">
                                <dt className="text-on-surface-variant">{detail.label}</dt>
                                <dd className="text-right font-medium text-on-surface">{detail.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-surface-variant/50 pt-5">
                    {tags.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/shop/tags/${tag.normalizedName}`}
                            className="rounded-full bg-surface-container px-3 py-1.5 text-sm text-on-surface-variant transition hover:text-primary"
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductTabs;
