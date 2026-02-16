import { apiArticleStatistics } from "@/services/catalogs/article";
import { ProCard, Statistic } from "@ant-design/pro-components"
import { FormattedNumber, useRequest } from "@umijs/max";

const ViewCount: React.FC = () => {

    const { data, loading } = useRequest(apiArticleStatistics);

    return (
        <ProCard title="Bài viết" headerBordered loading={loading}>
            <Statistic title="Số lượng bài viết"
                value={data?.totalArticles || 0} loading={loading}
                layout="vertical"
                suffix="bài viết"
                tip="Tổng số bài viết đã được tạo"
            />
            <div className="flex gap-4 mb-2">
                <div className="flex gap-2">
                    <span className="text-slate-600">Tháng trước</span>
                    <FormattedNumber value={data?.previousMonth || 0} />
                    <span className="text-slate-600">Tháng này</span>
                    <FormattedNumber value={data?.currentMonth || 0} />
                </div>
            </div>
            <div className="border-t pt-1">
                Tổng lượt xem: <span className="font-medium"><FormattedNumber value={data?.viewCount || 0} /></span>
            </div>
        </ProCard>
    )
}

export default ViewCount;