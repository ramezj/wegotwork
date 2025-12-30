"use server";

export async function TestAction() {
  // Simulate an async operation with a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "test - data loaded successfully!";
}
