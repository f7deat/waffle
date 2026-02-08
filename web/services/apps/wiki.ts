export async function apiWikiParse (page: string) {
  const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${page}&format=json`);
  const json = await response.json();
  return json;
}

export async function apiWikiSearch (query: string) {
  const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`);
  const json = await response.json();
  return json;
}

export async function apiWikiRandom () {
  const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json`);
  const json = await response.json();
  return json;
}