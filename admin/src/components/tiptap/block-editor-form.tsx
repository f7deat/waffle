import { getArguments } from '@/services/work-content';
import { useParams, useRequest } from '@umijs/max';
import FormEditor from './form-editor';

const BlockEditorForm: React.FC = () => {
  const { id } = useParams();
  const { data, loading } = useRequest(() => getArguments(id), {
    ready: !!id,
  });

  if (loading) {
    return null;
  }

  return <FormEditor name="blockEditor" initialValue={data} />;
};

export default BlockEditorForm;
