import {
    apiCategoryCreate,
    apiCategoryDelete,
    apiCategoryGet,
    apiCategoryOptions,
    apiCategoryTree,
    apiCategoryUpdate,
    type CategoryTreeItem,
    type SaveCategoryRequest,
} from '@/services/settings/category';
import {
    BranchesOutlined,
    CheckOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    FireFilled,
    FolderOutlined,
    LinkOutlined,
    PlusOutlined,
    SettingOutlined,
    TagOutlined,
} from '@ant-design/icons';
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProFormDigit,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const formRef = useRef<ProFormInstance>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoryTreeItem | null>(null);
    const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryTreeItem | null>(null);

    const allCategories = (items: CategoryTreeItem[]): CategoryTreeItem[] =>
        items.flatMap((item) => [item, ...allCategories(item.children)]);
    const categoryCount = (items: CategoryTreeItem[]): number =>
        items.reduce((count, item) => count + 1 + categoryCount(item.children), 0);
    const nestedCategoryCount = (items: CategoryTreeItem[]): number =>
        items.reduce((count, item) => count + item.children.length + nestedCategoryCount(item.children), 0);
    const flattenedCategories = allCategories(categories);
    const articleCategoryCount = flattenedCategories.filter((item) => item.type === 1).length;
    const productCategoryCount = flattenedCategories.filter((item) => item.type === 2).length;
    const productCategoryRate = categoryCount(categories) > 0
        ? Math.round((productCategoryCount / categoryCount(categories)) * 100)
        : 0;

    useEffect(() => {
        let isCurrent = true;

        const loadForm = async () => {
            if (category?.id) {
                const response = await apiCategoryGet(category.id);
                if (!isCurrent) return;
                if (!response.succeeded) {
                    message.error(response.message || 'Không thể tải danh mục.');
                    return;
                }

                const data = response.data;
                formRef.current?.setFieldsValue({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    parentId: data.parentId,
                    type: data.type,
                    locale: data.locale,
                });
                return;
            }

            formRef.current?.setFieldsValue({
                type: 1,
                locale: 'vi-VN',
            });
        };

        if (openForm) void loadForm();
        return () => {
            isCurrent = false;
        };
    }, [category, openForm]);

    const onFinish = async (values: SaveCategoryRequest) => {
        const response = values.id
            ? await apiCategoryUpdate(values)
            : await apiCategoryCreate(values);
        if (!response.succeeded) {
            message.error(response.message || 'Không thể lưu danh mục.');
            return false;
        }

        message.success(values.id ? 'Đã cập nhật danh mục.' : 'Đã tạo danh mục.');
        actionRef.current?.reload();
        setCategory(null);
        return true;
    };

    const handleDelete = async (id: number) => {
        const response = await apiCategoryDelete(id);
        if (!response.succeeded) {
            message.error(response.message || 'Không thể xóa danh mục.');
            return;
        }

        message.success('Đã xóa danh mục.');
        actionRef.current?.reload();
        if (selectedCategory?.id === id) {
            setSelectedCategory(null);
        }
    };

    const handleDetailSave = async () => {
        if (!selectedCategory) return;

        const response = await apiCategoryUpdate({
            id: selectedCategory.id,
            name: selectedCategory.name,
            description: selectedCategory.description ?? undefined,
            parentId: selectedCategory.parentId,
            type: selectedCategory.type,
            locale: selectedCategory.locale,
        });
        if (!response.succeeded) {
            message.error(response.message || 'Không thể cập nhật danh mục.');
            return;
        }

        message.success('Đã cập nhật danh mục.');
        actionRef.current?.reload();
    };

    const renderType = (type: number) => {
        if (type === 2) {
            return <Tag color="blue">Product</Tag>;
        }
        return <Tag color="green">Article</Tag>;
    };

    return (
        <PageContainer
            title="Quản lý Chuyên mục &amp; Thẻ bài viết" subTitle="TAXONOMY ENGINE"
            content={(
                <div>
                    Tổ chức phân tầng danh mục tin tức, cấu hình URL slug, chỉ mục SEO tự
                    động và chuẩn hóa siêu dữ liệu hashtag DefZone.Net.
                </div>
            )}
            extra={(
                <div className="flex items-center flex-wrap gap-2">
                    <Button icon={<DownloadOutlined />} type='primary'>
                        Xuất dữ liệu
                    </Button>
                    <Button icon={<TagOutlined />}>
                        + Tạo thẻ mới
                    </Button>
                    <Button
                        type="primary"
                        className="!border-0"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setCategory(null);
                            setOpenForm(true);
                        }}
                    >
                        Thêm danh mục
                    </Button>
                </div>
            )}
        >
            {/* KPI / Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                {/* Stat 1 */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                Tổng chuyên mục
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-headline-xl text-headline-xl text-on-surface">
                                    {categoryCount(categories)}
                                </span>
                                <span className="font-label-md text-label-md text-on-surface-variant">
                                    danh mục
                                </span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[22px]">
                                <FolderOutlined />
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-code-sm text-code-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            {categories.length} mục cha • {nestedCategoryCount(categories)} mục con
                        </span>
                    </div>
                </div>
                {/* Stat 2 */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                Danh mục Article
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-headline-xl text-headline-xl text-on-surface">
                                    {articleCategoryCount}
                                </span>
                                <span className="font-label-md text-label-md text-on-surface-variant">
                                    danh mục
                                </span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[22px]">
                                <TagOutlined />
                            </span>
                        </div>
                    </div>
                    <div className="mt-space-md flex items-center gap-2 text-on-surface-variant font-code-sm text-code-sm">
                        <span>Đồng bộ từ API danh mục</span>
                    </div>
                </div>
                {/* Stat 3 */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                Danh mục Product
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-headline-xl text-headline-xl text-on-surface">
                                    {productCategoryCount}
                                </span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-[22px]">
                                <CheckOutlined />
                            </span>
                        </div>
                    </div>
                    <div className="mt-space-md flex items-center gap-2">
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-secondary h-full rounded-full"
                                style={{ width: `${productCategoryRate}%` }}
                            />
                        </div>
                        <span className="font-code-sm text-code-sm text-on-surface-variant">
                            {productCategoryCount}/{categoryCount(categories)}
                        </span>
                    </div>
                </div>
                {/* Stat 4 */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 min-w-0">
                            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                Danh mục đang chọn
                            </span>
                            <div
                                className="truncate font-headline-md text-headline-md text-on-surface"
                                title={selectedCategory?.name ?? ''}
                            >
                                {selectedCategory?.name ?? 'Chưa chọn danh mục'}
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[22px]">
                                <FireFilled />
                            </span>
                        </div>
                    </div>
                    <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm">
                        <span>{selectedCategory?.locale ?? 'vi-VN'}</span>
                        <span className="font-label-md text-label-md text-secondary">
                            {selectedCategory ? (selectedCategory.type === 2 ? 'Product' : 'Article') : '—'}
                        </span>
                    </div>
                </div>
            </div>
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 mb-4">
                <div className="flex items-center gap-1">
                    <button className="inline-flex items-center gap-2 px-3 py-3 rounded-lg bg-blue-600 text-white font-label-md text-label-md shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                            <BranchesOutlined />
                        </span>
                        <span>Cây chuyên mục (Hierarchical Categories)</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 font-code-sm text-code-sm text-on-primary">
                            {categoryCount(categories)}
                        </span>
                    </button>
                    <Link to="/setting/tag">
                        <button className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-slate-200 transition-colors font-label-md text-label-md">
                            <span className="material-symbols-outlined text-[18px]">
                                <TagOutlined />
                            </span>
                            <span>Quản lý Thẻ bài viết (Tags)</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-on-surface font-code-sm text-code-sm">
                                482
                            </span>
                        </button>
                    </Link>
                    <button className="inline-flex items-center gap-2 px-3 py-3 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-slate-200 transition-colors font-label-md text-label-md">
                        <span className="material-symbols-outlined text-[18px]">
                            <LinkOutlined />
                        </span>
                        <span>Gộp &amp; Chuyển hướng URL (Redirects &amp; Merge)</span>
                    </button>
                </div>
                <div className="hidden md:flex items-center gap-space-sm pr-space-sm text-on-surface-variant font-code-sm text-code-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span>Đồng bộ CDN Cloudflare tự động</span>
                </div>
            </div>
            {/* Master-Detail Split Layout (7:5) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* LEFT SECTION: CÂY CHUYÊN MỤC TƯƠNG TÁC (Cols 7) */}
                <div className="xl:col-span-7 space-y-4">
                    <ProTable
                        actionRef={actionRef}
                        request={async (params) => {
                            const response = await apiCategoryTree({
                                locale: 'vi-VN',
                                name: params.name,
                                type: params.type,
                            });
                            const data = response.data ?? [];
                            setCategories(data);
                            setSelectedCategory((current) => {
                                const flatData = allCategories(data);
                                return current && flatData.some((item) => item.id === current.id)
                                    ? flatData.find((item) => item.id === current.id) ?? null
                                    : flatData[0] ?? null;
                            });

                            return {
                                data,
                                success: true,
                                total: categoryCount(data),
                            };
                        }}
                        rowKey={'id'}
                        pagination={false}
                        columns={[
                            {
                                title: '#',
                                valueType: 'indexBorder',
                                width: 50,
                                align: 'center',
                                hideInSearch: true,
                            },
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                render: (_, record) => (
                                    <a onClick={() => setSelectedCategory(record)}>{record.name}</a>
                                ),
                            },
                            {
                                title: 'Description',
                                dataIndex: 'description',
                                hideInSearch: true,
                                ellipsis: true,
                            },
                            {
                                title: 'Type',
                                dataIndex: 'type',
                                valueType: 'select',
                                valueEnum: {
                                    1: { text: 'Article' },
                                    2: { text: 'Product' },
                                },
                                render: (_, record) => renderType(record.type),
                            },
                            {
                                title: <SettingOutlined />,
                                valueType: 'option',
                                width: 80,
                                align: 'center',
                                render: (_, record) => [
                                    <Button
                                        key="edit"
                                        type="primary"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setCategory(record);
                                            setSelectedCategory(record);
                                            setOpenForm(true);
                                        }}
                                    />,
                                    <Popconfirm
                                        key="delete"
                                        title="Are you sure you want to delete this category?"
                                        onConfirm={() => handleDelete(record.id)}
                                    >
                                        <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                                    </Popconfirm>,
                                ],
                            },
                        ]}
                        search={{
                            layout: 'vertical',
                        }}
                    />
                    {/* Quick Batch Actions Strip */}
                    <div className="p-3 bg-blue-100 rounded-xl flex items-center justify-between text-body-sm font-body-sm">
                        <div className="flex items-center gap-2">
                            <input
                                className="rounded text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                                id="selectAllCats"
                                type="checkbox"
                            />
                            <label
                                className="text-on-surface font-label-md text-label-md cursor-pointer"
                                htmlFor="selectAllCats"
                            >
                                Chọn tất cả {categoryCount(categories)} chuyên mục
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 rounded bg-white hover:bg-slate-200 text-on-surface-variant font-label-sm text-label-sm transition-colors">
                                Xóa bộ nhớ cache Menu
                            </button>
                            <button className="px-3 py-1 rounded bg-white hover:bg-slate-200 text-on-surface-variant font-label-sm text-label-sm transition-colors">
                                Tái lập chỉ mục Sitemap.xml
                            </button>
                        </div>
                    </div>
                </div>
                {/* RIGHT SECTION: FORM THIẾT LẬP / CHỈNH SỬA CHI TIẾT (Cols 5) */}
                <div className="xl:col-span-5 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-space-lg">
                        {/* Detail Header */}
                        <div className="flex items-start justify-between pb-space-sm border-b border-surface-container-low">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-code-sm text-code-sm text-secondary bg-blue-100 px-2 py-0.5 rounded font-medium">
                                        {selectedCategory ? `#CAT-${selectedCategory.id}` : '#CAT'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        {selectedCategory ? selectedCategory.locale : 'Chưa chọn'}
                                    </span>
                                </div>
                                <h2 className="font-headline-md text-headline-md text-on-surface pt-1">
                                    {selectedCategory ? `Chỉnh sửa: ${selectedCategory.name}` : 'Chọn danh mục để chỉnh sửa'}
                                </h2>
                            </div>
                            <a
                                className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container font-label-sm text-label-sm"
                                href={selectedCategory?.normalizedName ? `https://defzone.net/${selectedCategory.normalizedName}` : undefined}
                                target="_blank"
                            >
                                <span>defzone.net</span>
                                <span className="material-symbols-outlined text-[14px]">
                                    open_in_new
                                </span>
                            </a>
                        </div>
                        {/* Form Elements */}
                        <div className="space-y-4">
                            {/* Name & Slug */}
                            <div className="space-y-space-xs">
                                <label className="block font-label-md text-label-md text-on-surface">
                                    Tên chuyên mục <span className="text-error">*</span>
                                </label>
                                <input
                                    className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary transition-all"
                                    type="text"
                                    value={selectedCategory?.name ?? ''}
                                    onChange={(event) => setSelectedCategory((current) => current ? { ...current, name: event.target.value } : current)}
                                />
                            </div>
                            <div className="space-y-space-xs">
                                <label className="block font-label-md text-label-md text-on-surface">
                                    Đường dẫn tĩnh (Slug URL) <span className="text-error">*</span>
                                </label>
                                <div className="flex items-center rounded-lg bg-blue-100 overflow-hidden focus-within:ring-2 focus-within:ring-secondary">
                                    <span className="pl-space-md text-on-surface-variant font-code-sm text-code-sm select-none">
                                        defzone.net/
                                    </span>
                                    <input
                                        className="w-full px-1.5 py-2 bg-transparent text-body-md font-body-md text-secondary font-medium focus:outline-none"
                                        type="text"
                                        value={selectedCategory?.normalizedName ?? ''}
                                        readOnly
                                    />
                                    <button
                                        className="pr-space-md text-on-surface-variant hover:text-on-surface"
                                        title="Khóa / Tự động sinh từ tên"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            sync
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {/* Parent Category & Display Order Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-space-xs">
                                    <label className="block font-label-md text-label-md text-on-surface">
                                        Chuyên mục cha
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                                        value={selectedCategory?.parentId ?? ''}
                                        onChange={(event) => setSelectedCategory((current) => current ? {
                                            ...current,
                                            parentId: event.target.value ? Number(event.target.value) : null,
                                        } : current)}
                                    >
                                        <option value="">[Không có - Là danh mục gốc]</option>
                                        {flattenedCategories
                                            .filter((item) => item.id !== selectedCategory?.id && item.type === selectedCategory?.type)
                                            .map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="space-y-space-xs">
                                    <label className="block font-label-md text-label-md text-on-surface">
                                        Thứ tự hiển thị
                                    </label>
                                    <input
                                        className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                                        min={1}
                                        type="number"
                                        defaultValue={3}
                                    />
                                </div>
                            </div>
                            {/* Description / Excerpt */}
                            <div className="space-y-space-xs">
                                <div className="flex items-center justify-between">
                                    <label className="font-label-md text-label-md text-on-surface">
                                        Mô tả chuyên mục (Sapo / Excerpt)
                                    </label>
                                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                                        {(selectedCategory?.description ?? '').length}/512 ký tự
                                    </span>
                                </div>
                                <textarea
                                    className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary transition-all resize-none"
                                    rows={3}
                                    value={selectedCategory?.description ?? ''}
                                    onChange={(event) => setSelectedCategory((current) => current ? { ...current, description: event.target.value } : current)}
                                />
                            </div>
                            {/* Category Banner & Icon (Image pipeline standard) */}
                            <div className="space-y-space-xs">
                                <label className="block font-label-md text-label-md text-on-surface">
                                    Ảnh bìa Header &amp; Icon chuyên mục
                                </label>
                                <div className="flex items-center gap-4 p-space-sm bg-blue-100 rounded-xl">
                                    <div
                                        className="w-20 h-14 bg-cover bg-center rounded-lg shadow-sm flex items-end justify-end p-1 flex-shrink-0"
                                        data-alt="Editorial gaming cover background, glowing cybernetic esports arena lighting, high-contrast cyan and deep blue accents, sleek modern hardware tournament branding."
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe-40vaW8MoWexK7SS8x8IOONBZXhf4aszYnf-C7HU69bzOHXuOD3NSWZVFCRAfkLi4Zr0mNF6WtgqM70hMRlBpB1RClTF-PZ7BLL09RJrlcFqr7gcR4WEoaQj4GxnbCA6p8Sd9t5NoupUt2nJT3r2VA9E_VTo9KYa07WExo7GLwbA-XKRKV6jjA55c9M6EzB9jcoVZ6gzig7IOh1zSkGlEak3LTLFaMvrjSVrU2wr0hEFEDIi3bK_Jw")'
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-white text-[14px] bg-black/60 p-0.5 rounded">
                                            photo_camera
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-label-md text-label-md text-on-surface block truncate">
                                            gaming-banner-2025.webp
                                        </span>
                                        <span className="font-code-sm text-code-sm text-on-surface-variant block">
                                            1920 × 480 px • 142 KB
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <button className="font-label-sm text-label-sm text-secondary hover:underline">
                                                Thay đổi
                                            </button>
                                            <span className="text-on-surface-variant text-[10px]">•</span>
                                            <button className="font-label-sm text-label-sm text-error hover:underline">
                                                Gỡ ảnh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Display Flags / Checkboxes */}
                            <div className="pt-space-xs space-y-2.5">
                                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                                    Cấu hình hiển thị trang người dùng
                                </span>
                                <label className="flex items-center gap-space-sm cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <input
                                        defaultChecked
                                        className="rounded text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                                        type="checkbox"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Hiển thị trên Menu chính (Top Navigation)
                                        </span>
                                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                                            Xuất hiện tại thanh menu cố định của website DefZone.Net
                                        </span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-space-sm cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <input
                                        defaultChecked
                                        className="rounded text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                                        type="checkbox"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Khối nổi bật trên trang chủ (Featured Category Block)
                                        </span>
                                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                                            Kích hoạt layout Bento Grid 3 cột riêng tại trang chủ
                                        </span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-space-sm cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <input
                                        defaultChecked
                                        className="rounded text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                                        type="checkbox"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Cho phép BTV chọn làm Chuyên mục chính (Primary Category)
                                        </span>
                                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                                            Dùng để tính toán Canonical URL chính xác cho bài viết đa danh
                                            mục
                                        </span>
                                    </div>
                                </label>
                            </div>
                            {/* Advanced SEO Optimization Block */}
                            <div className="pt-space-md border-t border-surface-container space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-secondary text-[18px]">
                                            search_insights
                                        </span>
                                        <h3 className="font-label-lg text-label-lg text-on-surface">
                                            Tối ưu hóa SEO &amp; Rich Snippets
                                        </h3>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-slate-200 font-code-sm text-code-sm text-secondary font-semibold">
                                        Score: 98/100
                                    </span>
                                </div>
                                {/* Meta Title */}
                                <div className="space-y-space-xs">
                                    <div className="flex items-center justify-between">
                                        <label className="font-label-md text-label-md text-on-surface">
                                            Tiêu đề SEO (Meta Title)
                                        </label>
                                        <span className="font-code-sm text-code-sm text-secondary bg-slate-200 px-1.5 py-0.2 rounded font-medium">
                                            58/60 ký tự (Tốt)
                                        </span>
                                    </div>
                                    <input
                                        className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                                        type="text"
                                        defaultValue="Tin tức Gaming & Esports 24/7 | Cẩm nang game thủ - DefZone.Net"
                                    />
                                </div>
                                {/* Meta Description */}
                                <div className="space-y-space-xs">
                                    <div className="flex items-center justify-between">
                                        <label className="font-label-md text-label-md text-on-surface">
                                            Mô tả SEO (Meta Description)
                                        </label>
                                        <span className="font-code-sm text-code-sm text-secondary bg-slate-200 px-1.5 py-0.2 rounded font-medium">
                                            145/160 ký tự (Chuẩn)
                                        </span>
                                    </div>
                                    <textarea
                                        className="w-full px-3 py-2 bg-blue-100 rounded-lg text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                                        rows={2}
                                        defaultValue={
                                            "Chuyên mục tin tức game, lịch thi đấu esports, đánh giá game mới và meta chiến thuật cập nhật liên tục trên DefZone.Net."
                                        }
                                    />
                                </div>
                                {/* Focus Keywords */}
                                <div className="space-y-space-xs">
                                    <label className="block font-label-md text-label-md text-on-surface">
                                        Từ khóa trọng tâm (Keywords / Tags)
                                    </label>
                                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-blue-100 rounded-lg">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-on-surface font-code-sm text-code-sm">
                                            gaming
                                            <button className="hover:text-error">
                                                <span className="material-symbols-outlined text-[12px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-on-surface font-code-sm text-code-sm">
                                            esports
                                            <button className="hover:text-error">
                                                <span className="material-symbols-outlined text-[12px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-on-surface font-code-sm text-code-sm">
                                            tin game
                                            <button className="hover:text-error">
                                                <span className="material-symbols-outlined text-[12px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-on-surface font-code-sm text-code-sm">
                                            giải đấu cktg
                                            <button className="hover:text-error">
                                                <span className="material-symbols-outlined text-[12px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <input
                                            className="bg-transparent text-code-sm font-code-sm px-1.5 py-0.5 focus:outline-none text-on-surface w-28"
                                            placeholder="+ Thêm từ khóa..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                                {/* Google SERP Live Simulation Card */}
                                <div className="space-y-1.5 pt-space-xs">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                                        Mô phỏng hiển thị Google Search SERP
                                    </span>
                                    <div className="p-space-md bg-white rounded-xl shadow-inner space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-white text-[9px] font-bold">
                                                D
                                            </div>
                                            <span className="font-code-sm text-[12px] text-on-surface-variant truncate">
                                                https://defzone.net &gt; gaming-esports
                                            </span>
                                        </div>
                                        <h4 className="font-headline-sm text-headline-sm text-secondary hover:underline cursor-pointer truncate">
                                            Tin tức Gaming &amp; Esports 24/7 | Cẩm nang game thủ -
                                            DefZone.Net
                                        </h4>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                            Chuyên mục tin tức game, lịch thi đấu esports, đánh giá game
                                            mới và meta chiến thuật cập nhật liên tục trên DefZone.Net.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-between pt-space-md border-t border-surface-container">
                            <button
                                className="px-3 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
                                onClick={() => actionRef.current?.reload()}
                            >
                                Hủy thay đổi
                            </button>
                            <div className="flex items-center gap-space-sm">
                                <button className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors">
                                    Lưu nháp
                                </button>
                                <button
                                    className="px-space-xl py-2 rounded-lg bg-primary text-on-primary hover:bg-on-surface-variant font-label-md text-label-md transition-all shadow-[0_2px_8px_rgba(11,28,48,0.15)] flex items-center gap-1.5"
                                    disabled={!selectedCategory}
                                    onClick={() => void handleDetailSave()}
                                >
                                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                                        save
                                    </span>
                                    <span>Lưu thay đổi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* BOTTOM SECTION: TAGS CLOUD & TRENDING HASHTAG MANAGER */}
            <div className="space-y-4 pt-space-md">
                {/* Section Header with Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px]">
                                whatshot
                            </span>
                            <h3 className="font-headline-md text-headline-md text-on-surface">
                                Thẻ xu hướng thịnh hành &amp; Quản trị Hashtag
                            </h3>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Các chủ đề nóng được BTV gắn thẻ nhiều nhất tuần này, đồng bộ tự động
                            với widget Trending Topics ngoài DefZone.Net.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-slate-200 text-on-surface font-label-sm text-label-sm transition-colors">
                            <span className="material-symbols-outlined text-[16px]">
                                merge_type
                            </span>
                            <span>Gộp thẻ trùng lặp</span>
                        </button>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-slate-200 text-error font-label-sm text-label-sm transition-colors">
                            <span className="material-symbols-outlined text-[16px]">
                                cleaning_services
                            </span>
                            <span>Dọn dẹp thẻ rác (0 bài)</span>
                        </button>
                    </div>
                </div>
                {/* Trending Tags Cloud Interactive Bar */}
                <div className="bg-white rounded-xl p-space-md shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-2">
                            Top thịnh hành:
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-md text-label-md shadow-sm cursor-pointer hover:opacity-90">
                            <span>#RTX-5090</span>
                            <span className="text-[11px] opacity-80 font-code-sm">184 bài</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md cursor-pointer hover:bg-secondary-fixed-dim">
                            <span>#Snapdragon-8-Elite</span>
                            <span className="text-[11px] text-on-secondary-fixed-variant font-code-sm">
                                142 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
                            <span>#CKTG-2024</span>
                            <span className="text-[11px] text-on-surface-variant font-code-sm">
                                118 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
                            <span>#DTCL-Mùa-13</span>
                            <span className="text-[11px] text-on-surface-variant font-code-sm">
                                96 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
                            <span>#Black-Myth-Wukong</span>
                            <span className="text-[11px] text-on-surface-variant font-code-sm">
                                89 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md cursor-pointer hover:bg-secondary-fixed-dim">
                            <span>#DeepSeek-R1</span>
                            <span className="text-[11px] text-on-secondary-fixed-variant font-code-sm">
                                84 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
                            <span>#Intel-Core-Ultra</span>
                            <span className="text-[11px] text-on-surface-variant font-code-sm">
                                73 bài
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
                            <span>#PlayStation-5-Pro</span>
                            <span className="text-[11px] text-on-surface-variant font-code-sm">
                                65 bài
                            </span>
                        </span>
                        <button className="p-1 rounded-full bg-blue-100 hover:bg-slate-200 text-on-surface-variant ml-auto">
                            <span className="material-symbols-outlined text-[18px]">
                                more_horiz
                            </span>
                        </button>
                    </div>
                </div>
                {/* Quick Tags Summary Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-100 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                    <th className="py-3 px-3 w-12 text-center">
                                        <input
                                            className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                                            type="checkbox"
                                        />
                                    </th>
                                    <th className="py-3 px-3">Tên thẻ (Tag Name)</th>
                                    <th className="py-3 px-3">Đường dẫn tĩnh (Slug)</th>
                                    <th className="py-3 px-3 text-center">Số bài viết</th>
                                    <th className="py-3 px-3 text-center">Lượt đọc tháng</th>
                                    <th className="py-3 px-3">Trạng thái SEO</th>
                                    <th className="py-3 px-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm text-on-surface">
                                {/* Row 1 */}
                                <tr className="hover:bg-blue-100/50 transition-colors">
                                    <td className="py-3 px-3 text-center">
                                        <input
                                            className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                                            type="checkbox"
                                        />
                                    </td>
                                    <td className="py-3 px-3 font-label-md text-label-md">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                                tag
                                            </span>
                                            <span>RTX 5090</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-code-sm text-code-sm text-on-surface-variant">
                                        /tag/rtx-5090
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm font-semibold">
                                        184
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm text-secondary">
                                        842,500 views
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            Index (Good)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-on-surface"
                                                title="Sửa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-secondary"
                                                title="Gộp với thẻ khác"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    call_merge
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-error-container text-on-surface-variant hover:text-error"
                                                title="Xóa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-blue-100/50 transition-colors">
                                    <td className="py-3 px-3 text-center">
                                        <input
                                            className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                                            type="checkbox"
                                        />
                                    </td>
                                    <td className="py-3 px-3 font-label-md text-label-md">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                                tag
                                            </span>
                                            <span>Snapdragon 8 Elite</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-code-sm text-code-sm text-on-surface-variant">
                                        /tag/snapdragon-8-elite
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm font-semibold">
                                        142
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm text-secondary">
                                        620,100 views
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            Index (Good)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-on-surface"
                                                title="Sửa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-secondary"
                                                title="Gộp với thẻ khác"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    call_merge
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-error-container text-on-surface-variant hover:text-error"
                                                title="Xóa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-blue-100/50 transition-colors">
                                    <td className="py-3 px-3 text-center">
                                        <input
                                            className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                                            type="checkbox"
                                        />
                                    </td>
                                    <td className="py-3 px-3 font-label-md text-label-md">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                                tag
                                            </span>
                                            <span>DeepSeek R1</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-code-sm text-code-sm text-on-surface-variant">
                                        /tag/deepseek-r1
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm font-semibold">
                                        84
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm text-secondary">
                                        510,400 views
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            Index (Good)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-on-surface"
                                                title="Sửa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-secondary"
                                                title="Gộp với thẻ khác"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    call_merge
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-error-container text-on-surface-variant hover:text-error"
                                                title="Xóa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="hover:bg-blue-100/50 transition-colors">
                                    <td className="py-3 px-3 text-center">
                                        <input
                                            className="rounded text-secondary focus:ring-secondary w-3.5 h-3.5"
                                            type="checkbox"
                                        />
                                    </td>
                                    <td className="py-3 px-3 font-label-md text-label-md">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                                                tag
                                            </span>
                                            <span>card-do-hoa-cu</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-code-sm text-code-sm text-on-surface-variant">
                                        /tag/card-do-hoa-cu
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm font-semibold text-error">
                                        0
                                    </td>
                                    <td className="py-3 px-3 text-center font-code-sm text-on-surface-variant">
                                        12 views
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-on-surface-variant font-label-sm text-label-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                                            Noindex (Empty)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-on-surface"
                                                title="Sửa thẻ"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 text-on-surface-variant hover:text-secondary"
                                                title="Gộp với thẻ khác"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    call_merge
                                                </span>
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-error-container text-error"
                                                title="Xóa ngay thẻ rác"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Footer */}
                    <div className="px-3 py-3 bg-blue-100/50 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
                        <span>Hiển thị 1 - 4 trong tổng số 482 thẻ</span>
                        <div className="flex items-center gap-1">
                            <button className="px-2.5 py-1 rounded bg-white text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
                                Trước
                            </button>
                            <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm">
                                1
                            </button>
                            <button className="px-2.5 py-1 rounded bg-white text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
                                2
                            </button>
                            <button className="px-2.5 py-1 rounded bg-white text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
                                3
                            </button>
                            <span className="px-1 text-on-surface-variant">...</span>
                            <button className="px-2.5 py-1 rounded bg-white text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
                                49
                            </button>
                            <button className="px-2.5 py-1 rounded bg-white text-on-surface font-label-sm text-label-sm hover:bg-surface-container">
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <ModalForm
                formRef={formRef}
                title={category?.id ? 'Edit Category' : 'Add Category'}
                open={openForm}
                onOpenChange={(visible) => {
                    setOpenForm(visible);
                    if (!visible) {
                        setCategory(null);
                        formRef.current?.resetFields();
                    }
                }}
                onFinish={onFinish}
            >
                <ProFormDigit name="id" hidden />
                <ProFormDigit name="type" hidden />
                <ProFormText name="locale" hidden />
                <ProFormText
                    name="name"
                    label="Tên danh mục"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter category name',
                        },
                    ]}
                />
                <ProFormTextArea name="description" label="Description" fieldProps={{ rows: 4 }} />
                <ProFormSelect
                    name="parentId"
                    label="Parent Category"
                    showSearch
                    request={(params) => apiCategoryOptions({
                        ...params,
                        locale: formRef.current?.getFieldValue('locale') || 'vi-VN',
                        type: formRef.current?.getFieldValue('type') || 1,
                        excludeId: category?.id,
                    })}
                />
            </ModalForm>
        </PageContainer>
    )
}

export default Index;