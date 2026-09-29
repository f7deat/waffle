const CONTENT_TYPE_LABELS: Record<string, string> = {
    Photo: "Ảnh",
    Video: "Video",
    Story: "Story",
    Reel: "Reel",
    Mixed: "Nhiều định dạng",
};

const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const CompletedJobs = ({ jobs }: { jobs: API.InfluencerCompletedJobItem[] }) => (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-end justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Kinh nghiệm hợp tác</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Job đã thực hiện</h2>
            </div>
            <span className="text-sm text-slate-500">{jobs.length} chiến dịch</span>
        </div>

        {jobs.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Chưa có job hoàn thành được ghi nhận.</p>
        ) : (
            <div className="divide-y divide-slate-100">
                {jobs.map((job) => (
                    <article key={job.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-slate-900">{job.title}</h3>
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    Đã hoàn thành
                                </span>
                            </div>
                            {(job.brand || job.category) && (
                                <p className="mt-1 text-sm text-slate-600">
                                    {[job.brand, job.category].filter(Boolean).join(" · ")}
                                </p>
                            )}
                            {job.description && (
                                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{job.description}</p>
                            )}
                        </div>
                        <div className="shrink-0 text-sm sm:text-right">
                            <p className="font-semibold text-slate-800">
                                {CONTENT_TYPE_LABELS[String(job.contentType)] ?? job.contentType}
                            </p>
                            <p className="mt-1 text-slate-500">
                                {formatMoney(job.budget)}{job.budgetMax ? ` - ${formatMoney(job.budgetMax)}` : ""}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        )}
    </section>
);

export default CompletedJobs;