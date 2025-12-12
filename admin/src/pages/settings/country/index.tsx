import CatalogForm from "@/components/form/catalog";
import { CatalogType } from "@/constants";
import { PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components"
import { Button } from "antd";
import { useState } from "react";

const Index: React.FC = () => {

    const [openForm, setOpenForm] = useState<boolean>(false);

    return (
        <PageContainer extra={<Button type="primary" onClick={() => setOpenForm(true)} icon={<PlusOutlined />}>Add Country</Button>}>
            <CatalogForm open={openForm} onOpenChange={setOpenForm} type={CatalogType.Country} />
        </PageContainer>
    )
}

export default Index;