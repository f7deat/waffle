import { ProFormText } from "@ant-design/pro-components";

const SiteSettings: React.FC = () => {
  return (
    <>
        <ProFormText name="name" label="Site Name" />
        <ProFormText name="logo" label="Site Logo" />
        <ProFormText name="title" label="Site Title" />
        <ProFormText name="description" label="Site Description" />
    </>
  );
};

export default SiteSettings;