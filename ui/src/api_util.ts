const baseUrl = process.env.VUE_APP_BASE_API_URL;

export namespace Api {
    export async function get(path) {
        const res = await fetch(baseUrl + path);
        if (!res.ok) throw Error(res.statusText);
        return await res.json();
    }
}