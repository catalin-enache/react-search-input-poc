export const getHints = async (value: string) => {
  const inputData = { inputString: value };
  // simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await fetch('http://localhost:3000/get-hints', {
    method: 'POST', // or 'GET' if the server supports
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputData)
  });
  const data = await response.json();
  return data.hints;
};

export const generateFakeHints = async (inputString: string) => {
  // simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    `${inputString || 'default hint 1'} ### (fake)`,
    `### ${inputString || 'default hint 2'} ### (fake)`,
    `### ${inputString || 'default hint 3'} (fake)`
  ];
};
