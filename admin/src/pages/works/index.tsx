import WorkSummary from "@/components/works/summary";
import { getArguments, saveArguments } from "@/services/work-content";
import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { history, useParams, useRequest } from "@umijs/max";
import { Button, Col, Empty, message, Row } from "antd";
import Jumbotron from "./jumbotron";
import Sponsor from "./sponsor";
import { LeftOutlined } from "@ant-design/icons";
import VideoPlaylist from "./video-playlist";
import { EditorComponent } from "./components";
import LatestNews from "./latest-news";
import { useRef } from "react";

const WorkPage: React.FC = () => {
    const { id } = useParams();
    const { data, loading } = useRequest(() => getArguments(id));
    const formRef = useRef<ProFormInstance>();

    const getChildren = () => {
        if (data?.componentName === 'Sponsor') return <Sponsor data={data.data} />;
        if (data?.componentName === 'VideoPlayList') return <VideoPlaylist data={data.data} />;
        if (data?.componentName === 'Editor') return <EditorComponent data={data.data} />;
        if (data?.componentName === 'Jumbotron') return <Jumbotron data={data?.data} />;
        if (data?.componentName === 'LatestNews') return <LatestNews data={data?.data} />;
        return <Empty />
    }

    const onFinish = async (values: any) => {
        const response = await saveArguments(id, values);
        if (response.succeeded) {
            message.success('Saved!');
        }
    };

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
                            children: (
                                <ProForm formRef={formRef} onFinish={onFinish}>
                                    <Row gutter={16}>
                                        <Col md={18}>
                                            {getChildren()}
                                        </Col>
                                        <Col md={6}>
                                            <ProFormText name="className" label="Class Name" initialValue={data?.data?.className} />
                                        </Col>
                                    </Row>
                                </ProForm>
                            )
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