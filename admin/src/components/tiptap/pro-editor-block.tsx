import { getBlockEditor } from '@/services/work-content';
import { useParams, useRequest } from '@umijs/max';
import { Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { blockOutputToTiptapHtml, tiptapJsonToBlockOutput } from './block-output';
import TiptapEditor from './index';

type ProEditorBlockProps = {
  onChange: (value: any) => void;
};

const ProEditorBlock: React.FC<ProEditorBlockProps> = ({ onChange }) => {
  const { id } = useParams();
  const { data, loading } = useRequest(() => getBlockEditor(id), {
    ready: !!id,
  });

  const initialOutput = useMemo(() => {
    return {
      blocks: Array.isArray(data) ? data : [],
      time: Date.now(),
      version: '2.31.0',
    };
  }, [data]);

  const initialContent = useMemo(() => blockOutputToTiptapHtml(initialOutput), [initialOutput]);

  useEffect(() => {
    if (!id) return;
    onChange({
      id,
      ...initialOutput,
    });
  }, [id, initialOutput, onChange]);

  if (loading) {
    return <Spin />;
  }

  return (
    <TiptapEditor
      value={initialContent}
      placeholder="Nhap noi dung..."
      onDocumentChange={(doc) => {
        if (!id) return;
        onChange({
          id,
          ...tiptapJsonToBlockOutput(doc),
        });
      }}
    />
  );
};

export default ProEditorBlock;
