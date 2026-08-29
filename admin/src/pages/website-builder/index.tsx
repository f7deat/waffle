import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HolderOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Empty, Input, Modal, Space, Switch, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  getWebsiteHomeForEditing,
  saveWebsiteHome,
  WebsiteBlock,
  WebsiteBlockType,
  WebsiteDocument,
} from '@/services/website-page';
import './style.less';

type BlockDefinition = {
  type: WebsiteBlockType;
  label: string;
  description: string;
  defaults: Record<string, string>;
  fields: Array<{ key: string; label: string; multiline?: boolean }>;
};

const BLOCKS: BlockDefinition[] = [
  {
    type: 'hero', label: 'Hero', description: 'Tiêu đề và lời kêu gọi hành động',
    defaults: { eyebrow: 'Khám phá', title: 'Một trang web theo cách của bạn', description: 'Tạo trải nghiệm rõ ràng và đáng nhớ cho khách truy cập.', buttonLabel: 'Tìm hiểu thêm', buttonUrl: '#', imageUrl: '' },
    fields: [{ key: 'eyebrow', label: 'Nhãn' }, { key: 'title', label: 'Tiêu đề', multiline: true }, { key: 'description', label: 'Mô tả', multiline: true }, { key: 'buttonLabel', label: 'Nhãn nút' }, { key: 'buttonUrl', label: 'Liên kết nút' }, { key: 'imageUrl', label: 'URL hình nền' }],
  },
  {
    type: 'richText', label: 'Nội dung', description: 'Khối văn bản tự do',
    defaults: { title: 'Nội dung nổi bật', body: 'Viết câu chuyện, giới thiệu dịch vụ hoặc chia sẻ thông tin quan trọng tại đây.' },
    fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'body', label: 'Nội dung', multiline: true }],
  },
  {
    type: 'featureGrid', label: 'Điểm nổi bật', description: 'Ba lợi ích chính',
    defaults: { title: 'Vì sao chọn chúng tôi', itemOne: 'Thiết kế linh hoạt', itemTwo: 'Nội dung có chiều sâu', itemThree: 'Tối ưu cho mọi thiết bị' },
    fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'itemOne', label: 'Điểm nổi bật 1' }, { key: 'itemTwo', label: 'Điểm nổi bật 2' }, { key: 'itemThree', label: 'Điểm nổi bật 3' }],
  },
  {
    type: 'image', label: 'Hình ảnh', description: 'Ảnh toàn chiều rộng',
    defaults: { imageUrl: '', alt: 'Hình ảnh minh họa', caption: '' },
    fields: [{ key: 'imageUrl', label: 'URL hình ảnh' }, { key: 'alt', label: 'Văn bản thay thế' }, { key: 'caption', label: 'Chú thích' }],
  },
  {
    type: 'cta', label: 'Kêu gọi hành động', description: 'Dẫn người dùng đến bước tiếp theo',
    defaults: { title: 'Sẵn sàng bắt đầu?', description: 'Kết nối với chúng tôi để nhận tư vấn phù hợp.', buttonLabel: 'Liên hệ ngay', buttonUrl: '/contact' },
    fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'description', label: 'Mô tả', multiline: true }, { key: 'buttonLabel', label: 'Nhãn nút' }, { key: 'buttonUrl', label: 'Liên kết nút' }],
  },
];

const definitionFor = (type: WebsiteBlockType) => BLOCKS.find((block) => block.type === type)!;

function createBlock(type: WebsiteBlockType): WebsiteBlock {
  return { id: crypto.randomUUID(), type, settings: { ...definitionFor(type).defaults } };
}

function PaletteBlock({ definition }: { definition: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: { source: 'palette', type: definition.type },
  });
  return (
    <button ref={setNodeRef} type="button" className="builder-palette-item" style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.45 : 1 }} {...listeners} {...attributes}>
      <PlusOutlined />
      <span><strong>{definition.label}</strong><small>{definition.description}</small></span>
    </button>
  );
}

function SortableBlock({ block, selected, onSelect }: { block: WebsiteBlock; selected: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const definition = definitionFor(block.type);
  return (
    <article ref={setNodeRef} className={`builder-canvas-block ${selected ? 'is-selected' : ''} ${block.hidden ? 'is-hidden' : ''}`} style={{ transform: CSS.Transform.toString(transform), transition }} onClick={onSelect}>
      <button type="button" className="builder-drag-handle" aria-label="Kéo để sắp xếp" {...attributes} {...listeners}><HolderOutlined /></button>
      <div className="builder-block-content">
        <Typography.Text type="secondary">{definition.label}</Typography.Text>
        <Typography.Title level={4}>{block.settings.title || block.settings.caption || definition.label}</Typography.Title>
        <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">{block.settings.description || block.settings.body || block.settings.imageUrl || definition.description}</Typography.Paragraph>
      </div>
      {block.hidden && <span className="builder-hidden-label">Đang ẩn</span>}
    </article>
  );
}

const emptyDocument: WebsiteDocument = { version: 1, blocks: [] };

const WebsiteBuilderPage: React.FC = () => {
  const [document, setDocument] = useState<WebsiteDocument>(emptyDocument);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const selectedBlock = document.blocks.find((block) => block.id === selectedId);

  useEffect(() => {
    getWebsiteHomeForEditing().then((response) => {
      setDocument(response?.content?.blocks ? response.content : emptyDocument);
      setIsPublished(Boolean(response?.isPublished));
    }).catch(() => message.error('Không thể tải cấu hình website')).finally(() => setLoading(false));
  }, []);

  const updateBlocks = (updater: (blocks: WebsiteBlock[]) => WebsiteBlock[]) => setDocument((current) => ({ ...current, blocks: updater(current.blocks) }));
  const addBlock = (type: WebsiteBlockType) => {
    const block = createBlock(type);
    updateBlocks((blocks) => [...blocks, block]);
    setSelectedId(block.id);
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const source = active.data.current?.source;
    if (source === 'palette') {
      addBlock(active.data.current?.type as WebsiteBlockType);
      return;
    }
    if (over && active.id !== over.id) updateBlocks((blocks) => arrayMove(blocks, blocks.findIndex((block) => block.id === active.id), blocks.findIndex((block) => block.id === over.id)));
  };
  const updateSelectedSetting = (key: string, value: string) => {
    if (!selectedId) return;
    updateBlocks((blocks) => blocks.map((block) => block.id === selectedId ? { ...block, settings: { ...block.settings, [key]: value } } : block));
  };
  const save = async () => {
    setSaving(true);
    try {
      await saveWebsiteHome({ content: { ...document, version: 1, updatedAt: new Date().toISOString() }, isPublished });
      message.success(isPublished ? 'Website đã được lưu và xuất bản' : 'Bản nháp đã được lưu');
    } catch {
      message.error('Không thể lưu cấu hình website');
    } finally {
      setSaving(false);
    }
  };

  return <PageContainer className="website-builder" loading={loading} extra={<Space><Switch checked={isPublished} onChange={setIsPublished} checkedChildren="Đã xuất bản" unCheckedChildren="Bản nháp" /><Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>Xem trước</Button><Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>Lưu</Button></Space>}>
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="builder-layout">
        <aside className="builder-sidebar"><Typography.Title level={5}>Khối nội dung</Typography.Title><Typography.Paragraph type="secondary">Kéo một khối vào canvas hoặc bấm để thêm.</Typography.Paragraph><div className="builder-palette">{BLOCKS.map((block) => <div key={block.type} onDoubleClick={() => addBlock(block.type)}><PaletteBlock definition={block} /></div>)}</div></aside>
        <main className="builder-canvas"><header><span>Trang chủ</span><Typography.Text type="secondary">{document.blocks.length} khối</Typography.Text></header><SortableContext items={document.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>{document.blocks.length ? document.blocks.map((block) => <SortableBlock key={block.id} block={block} selected={selectedId === block.id} onSelect={() => setSelectedId(block.id)} />) : <Empty description="Kéo block vào đây để bắt đầu" />}</SortableContext></main>
        <aside className="builder-inspector">{selectedBlock ? <><div className="builder-inspector-heading"><div><Typography.Text type="secondary">Đang chỉnh sửa</Typography.Text><Typography.Title level={5}>{definitionFor(selectedBlock.type).label}</Typography.Title></div><Space><Tooltip title="Nhân bản"><Button type="text" icon={<CopyOutlined />} onClick={() => { const copied = { ...selectedBlock, id: crypto.randomUUID(), settings: { ...selectedBlock.settings } }; updateBlocks((blocks) => { const index = blocks.findIndex((block) => block.id === selectedBlock.id); return [...blocks.slice(0, index + 1), copied, ...blocks.slice(index + 1)]; }); setSelectedId(copied.id); }} /></Tooltip><Tooltip title={selectedBlock.hidden ? 'Hiện block' : 'Ẩn block'}><Button type="text" icon={selectedBlock.hidden ? <EyeOutlined /> : <EyeInvisibleOutlined />} onClick={() => updateBlocks((blocks) => blocks.map((block) => block.id === selectedBlock.id ? { ...block, hidden: !block.hidden } : block))} /></Tooltip><Tooltip title="Xóa block"><Button type="text" danger icon={<DeleteOutlined />} onClick={() => { updateBlocks((blocks) => blocks.filter((block) => block.id !== selectedBlock.id)); setSelectedId(undefined); }} /></Tooltip></Space></div>{definitionFor(selectedBlock.type).fields.map((field) => <label className="builder-field" key={field.key}><span>{field.label}</span>{field.multiline ? <Input.TextArea rows={4} value={selectedBlock.settings[field.key]} onChange={(event) => updateSelectedSetting(field.key, event.target.value)} /> : <Input value={selectedBlock.settings[field.key]} onChange={(event) => updateSelectedSetting(field.key, event.target.value)} />}</label>)}</> : <Empty description="Chọn một block để chỉnh sửa" />}</aside>
      </div>
    </DndContext>
    <Modal open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} width={900} title="Xem trước trang chủ"><div className="builder-preview">{document.blocks.filter((block) => !block.hidden).map((block) => <section key={block.id} className={`preview-${block.type}`}>{block.type === 'image' && block.settings.imageUrl ? <img src={block.settings.imageUrl} alt={block.settings.alt} /> : <><h2>{block.settings.title}</h2><p>{block.settings.description || block.settings.body}</p>{block.settings.buttonLabel && <Button type="primary">{block.settings.buttonLabel}</Button>}</>}</section>)}</div></Modal>
  </PageContainer>;
};

export default WebsiteBuilderPage;