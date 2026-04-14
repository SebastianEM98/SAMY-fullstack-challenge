export interface ReqResUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface ReqResListResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: ReqResUser[];
}

export type ReqResUserId = ReqResUser['id'];
export type ReqResPage = ReqResListResponse['page'];