import { ProCard, Statistic } from "@ant-design/pro-components"
import { FormattedNumber } from "@umijs/max";

const Revenue: React.FC = () => {
    return (
        <ProCard title="Doanh thu" headerBordered>
            <Statistic
                title="Tổng doanh thu"
                layout="vertical"
                value={123456}
                precision={2}
                prefix="$"
                suffix="USD"
                tip="Tổng doanh thu từ tất cả các nguồn"
            />
            <div className="flex gap-4 mb-2">
                <div className="flex gap-2">
                    <span className="text-slate-600">Tháng trước</span>
                    <FormattedNumber value={98765} />
                    <span className="text-slate-600">Tăng trưởng</span>
                    <FormattedNumber value={12.34} style="unit" unit="percent" />
                </div>
            </div>
            <div className="border-t pt-1">
                Doanh số ngày: <FormattedNumber value={12345} />
            </div>
        </ProCard>
    )
}

export default Revenue;