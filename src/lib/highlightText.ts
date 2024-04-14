export const highlightText = (inputString: string, highlights: string) => {
  const tokens = highlights.split(' ').map((token) => token.trim());
  const bolded = tokens.reduce((acc, token) => {
    acc[token] = `<b>${token}</b>`;
    return acc;
  }, {} as any);
  const words = inputString
    .split(' ')
    .map((word) => word.trim())
    .filter(Boolean)
    .map((word) => bolded[word] || word)
    .join(' ');
  return `<span>${words}</span>`;
};
