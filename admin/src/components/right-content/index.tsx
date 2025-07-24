import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';
import NotificationBell from './notification';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang />
  );
};

export const Question = () => {
  return (
    <div className='flex items-center justify-center gap-4'>
      <NotificationBell />
      <QuestionCircleOutlined className="text-lg" />
    </div>
  );
};