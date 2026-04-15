export interface ReqResUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface ReqResUsersResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: ReqResUser[];
}

export interface LocalUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}