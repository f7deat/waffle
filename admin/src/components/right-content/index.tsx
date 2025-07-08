import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang />
  );
};

export const Question = () => {
  return (
    <div className='w-8 h-8 flex items-center justify-center cursor-pointer text-lg'>
      <QuestionCircleOutlined />
    </div>
  );
};