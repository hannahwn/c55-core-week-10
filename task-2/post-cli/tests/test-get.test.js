/**
 * Vitest tests for GET request functions
 * Tests the trainee's implementation of getMe() and getPosts()
 *
 * Uses mocked fetch to verify trainees are making correct API calls
 * without requiring a running API server.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import fetcher functions
let services;
try {
  services = await import('../src/services.solution.js');
} catch {
  services = await import('../src/services.js');
}
const { getMe, getPosts, setToken } = services;

describe('GET Functions', () => {
  let fetchMock;

  beforeEach(() => {
    // Mock the global fetch function before each test
    fetchMock = vi.spyOn(global, 'fetch');
    // Set a mock token for authenticated requests
    setToken('mock-jwt-token');
  });

  afterEach(() => {
    // Restore the original fetch after each test
    vi.restoreAllMocks();
    setToken(null);
  });

  describe('getMe()', () => {
    it('should make GET request to /users/me with Authorization header', async () => {
      // Mock successful response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: 'Alice' }),
      });

      await getMe();

      // Verify fetch was called with correct URL and auth header
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/users/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-jwt-token',
          }),
        })
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should return user information with correct structure', async () => {
      const mockData = { user: 'Alice' };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const data = await getMe();

      // Verify the function returns the expected data structure
      expect(data).toBeDefined();
      expect(data).toHaveProperty('user');
      expect(data.user).toBe('Alice');
    });

    it('should throw error when response is not ok (404)', async () => {
      // Mock 404 response (no user registered)
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'No user registered' }),
      });

      // Verify the function throws an error
      await expect(getMe()).rejects.toThrow();
    });
  });

  describe('getPosts()', () => {
    it('should make GET request to /posts/me with Authorization header', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      await getPosts();

      // Verify fetch was called with correct URL and auth header
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/posts/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-jwt-token',
          }),
        })
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should return an array of posts', async () => {
      const mockPosts = [
        { id: 1, text: 'First post', user: 'Alice' },
        { id: 2, text: 'Second post', user: 'Bob' },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockPosts,
      });

      const posts = await getPosts();

      // Verify the function returns an array
      expect(Array.isArray(posts)).toBe(true);
      expect(posts).toHaveLength(2);

      // Verify post structure
      expect(posts[0]).toHaveProperty('id');
      expect(posts[0]).toHaveProperty('text');
      expect(posts[0]).toHaveProperty('user');
      expect(posts[0].id).toBe(1);
      expect(posts[0].text).toBe('First post');
    });

    it('should return empty array when no posts exist', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const posts = await getPosts();

      expect(Array.isArray(posts)).toBe(true);
      expect(posts).toHaveLength(0);
    });
  });
});
