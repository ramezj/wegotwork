"use server";

export async function TestAction() {
  console.log("TestAction started...");
  // Simulate a longer async operation
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("TestAction completed!");
  return "test - data loaded successfully!";
}
