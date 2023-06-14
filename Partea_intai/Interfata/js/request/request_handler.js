export function sendRequest(URL, METHOD, payload) {
  const request = new XMLHttpRequest();

  request.open(METHOD, URL);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  request.send(JSON.stringify(payload));
  return request;
}

export async function sendFetchRequest(url, method, payload) {
  return await fetch(url, {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(payload)
  });
}

export async function sendJwtFetchRequest(URL, METHOD, payload, jwt) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`
  };

  const options = {
    method: METHOD,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(payload)
  };

  const response = await fetch(URL, options);
  return response;
}

export async function sendJwtFetchRequestWithoutBody(URL, METHOD, jwt) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}`
  };

  const options = {
    method: METHOD,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
  return await fetch(URL, options);
}
