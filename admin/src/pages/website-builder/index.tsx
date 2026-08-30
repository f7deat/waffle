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
    type: 'row', label: 'Row', description: 'Hàng gồm hai cột nội dung',
    defaults: {}, fields: [],
  },
  {
    type: 'col', label: 'Col', description: 'Cột chứa các block khác',
    defaults: {}, fields: [],
  },
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
  ...(['partner', 'sponsor'] as const).map((type) => {
    const label = type === 'partner' ? 'Đối tác' : 'Nhà tài trợ';
    const itemLabel = type === 'partner' ? 'đối tác' : 'nhà tài trợ';
    const positions = ['One', 'Two', 'Three', 'Four'];
    return {
      type,
      label,
      description: `Danh sách logo ${itemLabel}`,
      defaults: { title: type === 'partner' ? 'Đối tác của chúng tôi' : 'Nhà tài trợ', ...Object.fromEntries(positions.flatMap((position, index) => [[`logo${position}Url`, ''], [`logo${position}Name`, `${label} ${index + 1}`], [`logo${position}Link`, '']])) },
      fields: [{ key: 'title', label: 'Tiêu đề' }, ...positions.flatMap((position, index) => [{ key: `logo${position}Url`, label: `URL logo ${itemLabel} ${index + 1}` }, { key: `logo${position}Name`, label: `Tên ${itemLabel} ${index + 1}` }, { key: `logo${position}Link`, label: `Liên kết ${itemLabel} ${index + 1}` }])],
    };
  }),
  {
    type: 'image', label: 'Hình ảnh', description: 'Ảnh toàn chiều rộng',
    defaults: { imageUrl: '', alt: 'Hình ảnh minh họa', caption: '' },
    fields: [{ key: 'imageUrl', label: 'URL hình ảnh' }, { key: 'alt', label: 'Văn bản thay thế' }, { key: 'caption', label: 'Chú thích' }],
  },
  {
    type: 'html', label: 'HTML', description: 'Mã HTML tùy chỉnh',
    defaults: { html: '<div>Nhập mã HTML của bạn tại đây.</div>' },
    fields: [{ key: 'html', label: 'Mã HTML', multiline: true }],
  },
  {
    type: 'cta', label: 'Kêu gọi hành động', description: 'Dẫn người dùng đến bước tiếp theo',
    defaults: { title: 'Sẵn sàng bắt đầu?', description: 'Kết nối với chúng tôi để nhận tư vấn phù hợp.', buttonLabel: 'Liên hệ ngay', buttonUrl: '/contact' },
    fields: [{ key: 'title', label: 'Tiêu đề' }, { key: 'description', label: 'Mô tả', multiline: true }, { key: 'buttonLabel', label: 'Nhãn nút' }, { key: 'buttonUrl', label: 'Liên kết nút' }],
  },
];

const definitionFor = (type: WebsiteBlockType) => BLOCKS.find((block) => block.type === type)!;

function createBlock(type: WebsiteBlockType): WebsiteBlock {
  const block: WebsiteBlock = { id: crypto.randomUUID(), type, settings: { ...definitionFor(type).defaults } };
  if (type === 'row') block.children = [createBlock('col'), createBlock('col')];
  if (type === 'col') block.children = [];
  return block;
}

const isContainer = (block: WebsiteBlock) => block.type === 'row' || block.type === 'col';
const findBlock = (blocks: WebsiteBlock[], id?: string): WebsiteBlock | undefined => {
  for (const block of blocks) {
    if (block.id === id) return block;
    const match = findBlock(block.children || [], id);
    if (match) return match;
  }
  return undefined;
};
const updateBlock = (blocks: WebsiteBlock[], id: string, updater: (block: WebsiteBlock) => WebsiteBlock): WebsiteBlock[] => blocks.map((block) => block.id === id ? updater(block) : { ...block, children: block.children && updateBlock(block.children, id, updater) });
const appendToBlock = (blocks: WebsiteBlock[], id: string, child: WebsiteBlock): WebsiteBlock[] => updateBlock(blocks, id, (block) => ({ ...block, children: [...(block.children || []), child] }));
const removeBlock = (blocks: WebsiteBlock[], id: string): WebsiteBlock[] => blocks.filter((block) => block.id !== id).map((block) => ({ ...block, children: block.children && removeBlock(block.children, id) }));
const cloneBlock = (block: WebsiteBlock): WebsiteBlock => ({ ...block, id: crypto.randomUUID(), settings: { ...block.settings }, children: block.children?.map(cloneBlock) });

function PaletteBlock({ definition, onAdd }: { definition: BlockDefinition; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: { source: 'palette', type: definition.type },
  });
  return (
    <button ref={setNodeRef} type="button" className="builder-palette-item" style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.45 : 1 }} onClick={onAdd} {...listeners} {...attributes}>
      <PlusOutlined />
      <span><strong>{definition.label}</strong><small>{definition.description}</small></span>
    </button>
  );
}

function BlockCard({ block, selectedId, onSelect, dragHandle }: { block: WebsiteBlock; selectedId?: string; onSelect: (id: string) => void; dragHandle?: React.ButtonHTMLAttributes<HTMLButtonElement> }) {
  const definition = definitionFor(block.type);
  return <article className={`builder-canvas-block ${selectedId === block.id ? 'is-selected' : ''} ${block.hidden ? 'is-hidden' : ''} ${isContainer(block) ? 'is-container' : ''}`} onClick={(event) => { event.stopPropagation(); onSelect(block.id); }}>
    {dragHandle && <button type="button" className="builder-drag-handle" aria-label="Kéo để sắp xếp" {...dragHandle}><HolderOutlined /></button>}
    <div className="builder-block-content">
      <Typography.Text type="secondary">{definition.label}</Typography.Text>
      <Typography.Title level={4}>{block.settings.title || block.settings.caption || definition.label}</Typography.Title>
      <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">{block.settings.description || block.settings.body || block.settings.imageUrl || definition.description}</Typography.Paragraph>
    </div>
    {block.hidden && <span className="builder-hidden-label">Đang ẩn</span>}
    {isContainer(block) && <div className="builder-container-children">{block.children?.length ? block.children.map((child) => <BlockCard key={child.id} block={child} selectedId={selectedId} onSelect={onSelect} />) : <span>Chọn container này rồi thêm block từ danh sách bên trái.</span>}</div>}
  </article>;
}

function SortableBlock({ block, selectedId, onSelect }: { block: WebsiteBlock; selectedId?: string; onSelect: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}><BlockCard block={block} selectedId={selectedId} onSelect={onSelect} dragHandle={{ ...attributes, ...listeners }} /></div>
  );
}

function PreviewBlock({ block }: { block: WebsiteBlock }) {
  if (block.type === 'row') return <section className="preview-row">{block.children?.filter((child) => !child.hidden).map((child) => <PreviewBlock key={child.id} block={child} />)}</section>;
  if (block.type === 'col') return <div className="preview-col">{block.children?.filter((child) => !child.hidden).map((child) => <PreviewBlock key={child.id} block={child} />)}</div>;
  if (block.type === 'html') return <section className="preview-html"><pre>{block.settings.html || 'Chưa có mã HTML'}</pre></section>;
  if (block.type === 'partner' || block.type === 'sponsor') {
    const organizations = ['One', 'Two', 'Three', 'Four'].map((position) => ({ url: block.settings[`logo${position}Url`], name: block.settings[`logo${position}Name`], link: block.settings[`logo${position}Link`] })).filter((organization) => organization.url || organization.name);
    return <section className={`preview-${block.type}`}><h2>{block.settings.title}</h2><div className="preview-organization-grid">{organizations.map((organization, index) => {
      const content = organization.url ? <img src={organization.url} alt={organization.name} /> : <span>{organization.name}</span>;
      return organization.link ? <a key={index} href={organization.link} target="_blank" rel="noreferrer">{content}</a> : <div key={index}>{content}</div>;
    })}</div></section>;
  }
  return <section className={`preview-${block.type}`}>{block.type === 'image' && block.settings.imageUrl ? <img src={block.settings.imageUrl} alt={block.settings.alt} /> : <><h2>{block.settings.title}</h2><p>{block.settings.description || block.settings.body}</p>{block.settings.buttonLabel && <Button type="primary">{block.settings.buttonLabel}</Button>}</>}</section>;
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
  const selectedBlock = findBlock(document.blocks, selectedId);

  useEffect(() => {
    getWebsiteHomeForEditing().then((response) => {
      setDocument(response?.content?.blocks ? response.content : emptyDocument);
      setIsPublished(Boolean(response?.isPublished));
    }).catch(() => message.error('Không thể tải cấu hình website')).finally(() => setLoading(false));
  }, []);

  const updateBlocks = (updater: (blocks: WebsiteBlock[]) => WebsiteBlock[]) => setDocument((current) => ({ ...current, blocks: updater(current.blocks) }));
  const addBlock = (type: WebsiteBlockType) => {
    const block = createBlock(type);
    updateBlocks((blocks) => selectedBlock && isContainer(selectedBlock) ? appendToBlock(blocks, selectedBlock.id, block) : [...blocks, block]);
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
    updateBlocks((blocks) => updateBlock(blocks, selectedId, (block) => ({ ...block, settings: { ...block.settings, [key]: value } })));
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
        <aside className="builder-sidebar"><Typography.Title level={5}>Khối nội dung</Typography.Title><Typography.Paragraph type="secondary">Chọn Row hoặc Col để chèn block vào bên trong.</Typography.Paragraph><div className="builder-palette">{BLOCKS.map((block) => <PaletteBlock key={block.type} definition={block} onAdd={() => addBlock(block.type)} />)}</div></aside>
        <main className="builder-canvas"><header><span>Trang chủ</span><Typography.Text type="secondary">{document.blocks.length} khối</Typography.Text></header><SortableContext items={document.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>{document.blocks.length ? document.blocks.map((block) => <SortableBlock key={block.id} block={block} selectedId={selectedId} onSelect={setSelectedId} />) : <Empty description="Thêm block để bắt đầu" />}</SortableContext></main>
        <aside className="builder-inspector">{selectedBlock ? <><div className="builder-inspector-heading"><div><Typography.Text type="secondary">Đang chỉnh sửa</Typography.Text><Typography.Title level={5}>{definitionFor(selectedBlock.type).label}</Typography.Title></div><Space><Tooltip title="Nhân bản"><Button type="text" icon={<CopyOutlined />} onClick={() => { const copied = cloneBlock(selectedBlock); updateBlocks((blocks) => [...blocks, copied]); setSelectedId(copied.id); }} /></Tooltip><Tooltip title={selectedBlock.hidden ? 'Hiện block' : 'Ẩn block'}><Button type="text" icon={selectedBlock.hidden ? <EyeOutlined /> : <EyeInvisibleOutlined />} onClick={() => updateBlocks((blocks) => updateBlock(blocks, selectedBlock.id, (block) => ({ ...block, hidden: !block.hidden })))} /></Tooltip><Tooltip title="Xóa block"><Button type="text" danger icon={<DeleteOutlined />} onClick={() => { updateBlocks((blocks) => removeBlock(blocks, selectedBlock.id)); setSelectedId(undefined); }} /></Tooltip></Space></div>{isContainer(selectedBlock) && <Typography.Paragraph type="secondary">Chọn một block ở danh sách bên trái để thêm vào container này.</Typography.Paragraph>}{definitionFor(selectedBlock.type).fields.map((field) => <label className="builder-field" key={field.key}><span>{field.label}</span>{field.multiline ? <Input.TextArea rows={4} value={selectedBlock.settings[field.key]} onChange={(event) => updateSelectedSetting(field.key, event.target.value)} /> : <Input value={selectedBlock.settings[field.key]} onChange={(event) => updateSelectedSetting(field.key, event.target.value)} />}</label>)}</> : <Empty description="Chọn một block để chỉnh sửa" />}</aside>
      </div>
    </DndContext>
    <Modal open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} width={900} title="Xem trước trang chủ"><div className="builder-preview">{document.blocks.filter((block) => !block.hidden).map((block) => <PreviewBlock key={block.id} block={block} />)}</div></Modal>
  </PageContainer>;
};

export default WebsiteBuilderPage;