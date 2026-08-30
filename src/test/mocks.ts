import { vi } from "vitest";

// A shared mock axios client. Tests configure the resolved/rejected values
// per method before rendering. Reset between tests with resetHttpClient().
export const httpClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

export const resetHttpClient = () => {
  httpClient.get.mockReset();
  httpClient.post.mockReset();
  httpClient.put.mockReset();
  httpClient.delete.mockReset();
};

// Builds an axios-style rejected error carrying a server error message, so
// tests can exercise the serverMessage() error-surfacing path.
export const axiosError = (message: string, status = 400) => ({
  response: { status, data: { error: message } },
});

// Mutable current user for the useUser() mock. Tests set this before render.
export const mockUser: { current: any } = {
  current: { userSub: "auth0|test", email: "t@example.com", pro: 0 },
};

export const setMockUser = (u: any) => {
  mockUser.current = u;
};
