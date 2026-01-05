"use server";

export async function TestAction() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "Hello from backend!";
}
