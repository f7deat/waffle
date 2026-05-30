import { request } from "@umijs/max";

type ReportActivityParams = {
	fromDate?: string;
	toDate?: string;
};

export const apiGetReportActivity = (params?: ReportActivityParams) => request(`report/activity`, { params });