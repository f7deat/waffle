import { request } from "@umijs/max";

export interface CommentQuery {
  current: number;
  pageSize: number;
  searchTerm?: string;
  catalogId?: string;
  status?: number;
  reported?: boolean;
}

export interface CommentModerationRule {
  id: string;
  name: string;
  description?: string;
  pattern: string;
  action: number;
  isEnabled: boolean;
  matchCount: number;
}

export async function queryComments(params: CommentQuery) {
  return request(`comment/admin/list`, { params });
}

export async function queryCommentStats() {
  return request(`comment/admin/stats`);
}

export async function queryCommentCatalogs() {
  return request(`comment/admin/catalogs`);
}

export async function activeComment(commentId: string) {
  return request(`comment/active/${commentId}`, {
    method: 'POST'
  });
}

export async function removeComment(commentId: string) {
  return request(`comment/remove/${commentId}`, {
    method: 'POST',
  });
}

export async function moderateComment(commentId: string, status: number) {
  return request(`comment/admin/${commentId}/moderate`, {
    method: 'POST',
    data: status,
  });
}

export async function moderateComments(ids: string[], status: number) {
  return request(`comment/admin/bulk-moderate`, {
    method: 'POST',
    data: { ids, status },
  });
}

export async function setCommentPinned(commentId: string, isPinned: boolean) {
  return request(`comment/admin/${commentId}/pin`, {
    method: 'POST',
    data: isPinned,
  });
}

export async function replyToComment(commentId: string, content: string) {
  return request(`comment/admin/reply`, {
    method: 'POST',
    data: { commentId, content },
  });
}

export async function queryCommentRules() {
  return request<CommentModerationRule[]>(`comment/admin/rules`);
}

export async function saveCommentRule(rule: Partial<CommentModerationRule>) {
  return request(`comment/admin/rules`, {
    method: "POST",
    data: rule,
  });
}

export async function deleteCommentRule(ruleId: string) {
  return request(`comment/admin/rules/${ruleId}`, {
    method: "DELETE",
  });
}