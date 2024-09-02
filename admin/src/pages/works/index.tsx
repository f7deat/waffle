import WorkSummary from "@/components/works/summary";
import { getArguments, saveArguments } from "@/services/work-content";
import { PageContainer, ProCard, ProForm, ProFormInstance } from "@ant-design/pro-components";
import { history, useParams, useRequest } from "@umijs/max";
import { Button, message } from "antd";
import { useRef } from "react";
import Jumbotron from "./jumbotron";
import Sponsor from "./sponsor";
import { LeftOutlined } from "@ant-design/icons";
import VideoPlaylist from "./video-playlist";
import { EditorComponent } from "./components";

const WorkPage: React.FC = () => {
    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();
    const { data, loading } = useRequest(() => getArguments(id));

    const onFinish = async (values: any) => {
        const response = await saveArguments(id, values);
        if (response.succeeded) {
            message.success('Saved!');
        }
    };

    const getChildren = () => {
        if (data?.componentName === 'Sponsor') return <Sponsor data={data.data} />;
        if (data?.componentName === 'VideoPlayList') return <VideoPlaylist data={data.data} />;
        if (data?.componentName === 'Editor') return <EditorComponent data={data.data} />;
        return (
            <ProForm onFinish={onFinish} formRef={formRef}>
                <Jumbotron data={data?.data} />
            </ProForm>
        )
    }

    return (
        <PageContainer subTitle={data?.componentName} title={data?.name} loading={loading} extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Quay lại</Button>}>
            <ProCard
                tabs={{
                    tabPosition: 'top',
                    items: [
                        {
                            key: 'content',
                            tabKey: 'content',
                            label: 'Content',
                            children: getChildren()
                        },
                        {
                            key: 'setting',
                            tabKey: 'setting',
                            label: 'Setting',
                            children: <WorkSummary />
                        }
                    ]
                }}
            />
        </PageContainer>
    )
}

export default WorkPage;