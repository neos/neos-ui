export type WorkspaceName = string;

export interface Workspace {
    name: WorkspaceName;
    title: string;
    readonly: boolean;
}
