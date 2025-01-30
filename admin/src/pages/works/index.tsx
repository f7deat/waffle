import WorkSummary from "@/components/works/summary";
import { getArguments, saveArguments } from "@/services/work-content";
import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { history, useParams, useRequest } from "@umijs/max";
import { Button, Collapse, Empty, message } from "antd";
import Jumbotron from "./jumbotron";
import Sponsor from "./sponsor";
import { FormOutlined, LeftOutlined, SettingOutlined } from "@ant-design/icons";
import VideoPlaylist from "./video-playlist";
import { EditorComponent, HtmlBlock, ListGroupComponent } from "./components";
import LatestNews from "./latest-news";
import { useEffect, useRef } from "react";
import RowComponent from "./row";
import ArticlePicker from "./article-picker";
import ArticleLister from "./article-lister";
import Feed from "./feed";
import JobLister from "./components/listers/job-lister";
import RankComponent from "./components/rank";

const WorkPage: React.FC = () => {
    const { id } = useParams();
    const { data, loading, refresh } = useRequest(() => getArguments(id));
    const formRef = useRef<ProFormInstance>();
    useEffect(() => {
        if (id) {
            refresh()
        }
    }, [id]);

    const getChildren = () => {
        if (data?.normalizedName === 'Sponsor') return <Sponsor data={data.data} />;
        if (data?.normalizedName === 'VideoPlayList') return <VideoPlaylist data={data.data} />;
        if (data?.normalizedName === 'Editor') return <EditorComponent data={data.data} />;
        if (data?.normalizedName === 'Jumbotron') return <Jumbotron data={data?.data} />;
        if (data?.normalizedName === 'LatestNews') return <LatestNews data={data?.data} />;
        if (data?.normalizedName === 'Row') return <RowComponent data={data?.data} />;
        if (data?.normalizedName === 'ArticlePicker') return <ArticlePicker data={data?.data} />;
        if (data?.normalizedName === 'ArticleLister') return <ArticleLister data={data?.data} />;
        if (data?.normalizedName === 'Html') return <HtmlBlock data={data?.data} />;
        if (data?.normalizedName === 'Feed') return <Feed data={data?.data} />;
        if (data?.normalizedName === 'JobLister') return <JobLister data={data?.data} />;
        if (data?.normalizedName === 'Rank') return <RankComponent data={data?.data} />;
        if (data?.normalizedName === 'ListGroup') return <ListGroupComponent data={data?.data} />;
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
                    tabPosition: 'left',
                    items: [
                        {
                            key: 'content',
                            tabKey: 'content',
                            icon: <FormOutlined />,
                            label: 'Content',
                            children: (
                                <ProForm formRef={formRef} onFinish={onFinish}>
                                    <Collapse items={[
                                        {
                                            key: 'setting',
                                            label: 'Nội dung',
                                            children: (
                                                <div className="bg-white p-4 rounded">
                                                    <ProFormText name="className" label="Class Name" initialValue={data?.data?.className} />
                                                </div>
                                            ),
                                            className: 'p-0'
                                        }
                                    ]} bordered={false} expandIconPosition="end" className="mb-2" expandIcon={() => <SettingOutlined />} />
                                    {getChildren()}
                                </ProForm>
                            )
                        },
                        {
                            key: 'setting',
                            tabKey: 'setting',
                            icon: <SettingOutlined />,
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