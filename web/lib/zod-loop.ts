export function getFirstZodErrorMessage(errors: Record<string, string[] | undefined>): string {
  for (const key in errors) {
    if (errors[key] && errors[key]!.length > 0) {
      return errors[key]![0];
    }
  }
  return "An unknown error occurred.";
}
