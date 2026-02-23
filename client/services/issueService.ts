import api from "@/lib/api";

export interface Issue {
  _id: string;
  Issue_Id: string;
  Title: string;
  Description: string;
  Status: string;
  Priority: string;
  Reporter: string;
  Assignee?: string | null;
}

export const getIssues = async (): Promise<Issue[]> => {
  const res = await api.get("/issues");
  return res.data.issues;
};

export const getIssueById = async (id: string): Promise<Issue> => {
  const res = await api.get(`/issues/${id}`);
  return res.data.issue;
};

export const createIssue = async (
  Title: string,
  Description: string,
  Priority: string,
  Assignee?: string,
): Promise<Issue> => {
  const res = await api.post("/issues", {
    Title,
    Description,
    Priority,
    Assignee: null,
  });
  return res.data.issue;
};

export const updateIssue = async (
  id: string,
  updates: Partial<Omit<Issue, "Issue_Id" | "_id">>,
): Promise<Issue> => {
  const res = await api.put(`/issues/${id}`, updates);
  return res.data.issue;
};

export const deleteIssue = async (id: string): Promise<void> => {
  await api.delete(`/issues/${id}`);
};
