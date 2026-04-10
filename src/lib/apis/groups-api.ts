import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface Group {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface ListGroupsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GroupMember {
  userId: string;
  email: string;
  firstName?: string;
  familyName?: string;
  addedAt: string;
}

export class GroupsApi {
  constructor(private http: HttpClient) {}

  async listGroups(params?: ListGroupsParams): Promise<PagedResult<Group>> {
    return this.http.request<PagedResult<Group>>({
      method: 'GET',
      path: '/groups',
      params,
    });
  }

  async getGroup(groupId: string): Promise<Group> {
    return this.http.request<Group>({
      method: 'GET',
      path: `/groups/${groupId}`,
    });
  }

  async createGroup(request: CreateGroupRequest): Promise<Group> {
    return this.http.request<Group>({
      method: 'POST',
      path: '/groups',
      body: request,
    });
  }

  async updateGroup(groupId: string, request: UpdateGroupRequest): Promise<Group> {
    return this.http.request<Group>({
      method: 'PUT',
      path: `/groups/${groupId}`,
      body: request,
    });
  }

  async deleteGroup(groupId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/groups/${groupId}`,
    });
  }

  async getGroupMembers(
    groupId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PagedResult<GroupMember>> {
    return this.http.request<PagedResult<GroupMember>>({
      method: 'GET',
      path: `/groups/${groupId}/members`,
      params,
    });
  }

  async addGroupMember(groupId: string, userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/groups/${groupId}/members`,
      body: { userId },
    });
  }

  async removeGroupMember(groupId: string, userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/groups/${groupId}/members/${userId}`,
    });
  }
}
