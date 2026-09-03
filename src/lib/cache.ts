type Entry<T> = { value:T; expires:number };
const cache = new Map<string, Entry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

export async function cached<T>(key:string, ttlSeconds:number, loader:()=>Promise<T>, refresh=false):Promise<T> {
  const existing = cache.get(key) as Entry<T> | undefined;
  if (!refresh && existing && existing.expires > Date.now()) { console.info("CACHE HIT", key); return existing.value; }
  if (!refresh && pending.has(key)) { console.info("CACHE WAIT", key); return pending.get(key) as Promise<T>; }
  console.info(refresh ? "CACHE REFRESH" : "CACHE MISS", key);
  const request = loader().then(value => { cache.set(key, { value, expires: Date.now() + ttlSeconds * 1000 }); return value; }).finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
export function invalidate(key:string) { cache.delete(key); }
