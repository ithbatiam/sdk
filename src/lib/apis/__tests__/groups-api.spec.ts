import { GroupsApi } from '../groups-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}) } as unknown as HttpClient;
}

describe('GroupsApi', () => {
  let http: HttpClient;
  let api: GroupsApi;

  beforeEach(() => {
    http = mockHttp();
    api = new GroupsApi(http);
  });

  it('listGroups passes params', async () => {
    await api.listGroups({ page: 1 });
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/groups', params: { page: 1 } });
  });

  it('getGroup encodes the id', async () => {
    await api.getGroup('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/groups/a%2Fb' });
  });

  it('createGroup posts the body', async () => {
    await api.createGroup({ name: 'Eng' });
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/groups', body: { name: 'Eng' } });
  });

  it('updateGroup encodes the id and posts the body', async () => {
    await api.updateGroup('g1', { name: 'Eng2' });
    expect(http.request).toHaveBeenCalledWith({ method: 'PUT', path: '/groups/g1', body: { name: 'Eng2' } });
  });

  it('deleteGroup encodes the id', async () => {
    await api.deleteGroup('g1');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/groups/g1' });
  });

  it('getGroupMembers encodes the id and passes params', async () => {
    await api.getGroupMembers('g 1', { page: 2 });
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/groups/g%201/members',
      params: { page: 2 },
    });
  });

  it('addGroupMember encodes the id and posts the userId', async () => {
    await api.addGroupMember('g1', 'u1');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/groups/g1/members',
      body: { userId: 'u1' },
    });
  });

  it('removeGroupMember encodes both ids', async () => {
    await api.removeGroupMember('g/1', 'u/2');
    expect(http.request).toHaveBeenCalledWith({
      method: 'DELETE',
      path: '/groups/g%2F1/members/u%2F2',
    });
  });
});
