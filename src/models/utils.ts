export function validateJournalEntry(content: string): boolean {
  return content.length > 0 && content.length <= 500;
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
