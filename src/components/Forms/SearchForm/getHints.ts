// @ts-ignore
import { getRandomChars } from 'lib/getRandomChars';
/*
This can be improved by having an AbortController instance per request hash,
where a request hash is a hash of the URL+VERB+Body,
basically what makes it unique such that, we abort only the exactly same request.
In this POC it is not necessary, since we have just a URL.
*/
let controller = new AbortController();
let requestStarted: boolean = false;
export const getHints = async (value: string) => {
  const inputData = { inputString: value };
  try {
    if (requestStarted) {
      controller.abort();
      controller = new AbortController();
    }
    const { signal } = controller;
    requestStarted = true;
    const response = await fetch('http://localhost:3000/get-hints', {
      method: 'POST', // or 'GET' if the server supports
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputData),
      signal
    });
    const data = await response.json();
    requestStarted = false;
    return data.hints;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.log('Server is down:', err.message);
      console.log('Falling back to fake hints');
    }
    requestStarted = false;
    return generateFakeHints(value);
  }
};

export const generateFakeHints = async (inputString: string) => {
  // simulate a delay of 300ms
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    `${inputString || 'default hint 1'} ${getRandomChars(3)}`,
    `${getRandomChars(3)} ${inputString || 'default hint 2'} ${getRandomChars(3)}`,
    `${getRandomChars(3)} ${inputString || 'default hint 3'}`
  ];
};
