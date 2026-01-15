export async function getSession() {
  return {
    token: "mock-token-123",
    user: { name: "Admin" },
  };
}
