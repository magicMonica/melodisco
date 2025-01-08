import { genUniSeq, genUuid } from "@/utils";

const apiBaseUri = "https://studio-api.suno.ai";

export async function genSong(
  task_uuid: string,
  description: string,
  title?: string,
  lyrics?: string,
  is_no_lyrics?: boolean,
  tags?: string
) {
  try {
    if (process.env.SUNOAPI_ENABLE === "true") {
      return genSongWithSunoApi(
        task_uuid,
        description,
        title,
        lyrics,
        is_no_lyrics,
        tags
      );
    }

    const uri = `${apiBaseUri}/api/generate/v2/`;
    const headers = await getReqHeaders();
    const params = {
      gpt_description_prompt: description,
      title: title,
      prompt: lyrics,
      make_instrumental: is_no_lyrics,
      tags: tags,
      mv: "chirp-v3-0",
    };

    console.log("gen song params", params);

    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("gen music failed: ", e);
  }
}

export async function genSongWithSunoApi(
  task_uuid: string,
  description: string,
  title?: string,
  lyrics?: string,
  is_no_lyrics?: boolean,
  tags?: string
) {
  try {
    const callbackUrl = `${process.env.SUNOAPI_CALLBACK_BASE_URL}/api/gen-song-callback/${task_uuid}`;
    console.log("gen song callback url", callbackUrl);

    const uri = `${process.env.SUNOAPI_BASE_URL}/api/v1/generate`;
    let params = null;
    if (lyrics) {
      params = {
        customMode: true,
        instrumental: is_no_lyrics,
        title: title,
        prompt: lyrics,
        style: tags,
        callBackUrl: callbackUrl,
      };
    } else {
      params = {
        customMode: false,
        instrumental: is_no_lyrics,
        prompt: description,
        callBackUrl: callbackUrl,
      };
    }

    const resp = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUNOAPI_API_KEY}`,
      },
      body: JSON.stringify(params),
    });
    const { code, msg, data } = await resp.json();
    console.log("gen song with sunoapi:", code, msg, data);
    if (code !== 200) {
      console.log("gen song failed:", msg);
      return;
    }
    const uuid1 = genUniSeq();
    const uuid2 = genUniSeq();

    return {
      clips: [
        {
          id: `SUNOAPI_${uuid1}`,
        },
        {
          id: `SUNOAPI_${uuid2}`,
        },
      ],
    };
  } catch (e) {
    console.log("gen song with suno api failed:", e);
  }
}

export async function genLyrics(description: string) {
  try {
    const uri = `${apiBaseUri}/api/generate/lyrics/`;
    const headers = await getReqHeaders();
    const params = {
      prompt: description,
    };

    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(params),
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("gen lyrics failed: ", e);
  }
}

export async function getLyrics(taskid: string) {
  try {
    const uri = `${apiBaseUri}/api/generate/lyrics/${taskid}`;
    console.log("uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get lyrics failed:", e);
    return [];
  }
}

export async function getTrendingSongs(page: number) {
  try {
    const uri = `${apiBaseUri}/api/playlist/${
      process.env.SUNO_TRENDING_UUID
    }/?page=${page || 1}`;
    console.log("api uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get trending songs failed:", e);
    return [];
  }
}

export async function getLatestSongs(page: number) {
  try {
    const uri = `${apiBaseUri}/api/playlist/${
      process.env.SUNO_LATEST_UUID
    }/?page=${page || 1}`;
    console.log("api uri", uri);
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get latest songs failed:", e);
    return [];
  }
}

export async function getSongInfo(ids: string[]) {
  try {
    const uri = `${apiBaseUri}/api/feed/v2?ids=${encodeURIComponent(
      ids.join(",")
    )}`;
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });

    console.log("res", headers, resp);
    const data = await resp.json();

    return data;
  } catch (e) {
    console.log("get music info failed: ", e);
  }
}

export async function getBillingInfo() {
  try {
    const uri = `${apiBaseUri}/api/billing/info/`;
    const headers = await getReqHeaders();

    const resp = await fetch(uri, {
      headers: headers,
    });
    const data = await resp.json();
    console.log("headers", uri, headers);
    return data;
  } catch (e) {
    console.log("get billing info failed: ", e);
  }
}

export async function getJwtToken() {
  try {
    const sessionId = process.env.SUNO_SESSION_ID;

    // const uri = `https://clerk.suno.com/v1/client/sessions/${sessionId}/tokens?_clerk_js_version=4.70.5`;
    const uri = `https://clerk.suno.com/v1/client/sessions/${sessionId}/tokens?__clerk_api_version=2024-10-01&_clerk_js_version=5.43.2`;

    const headers: any = {
      cookie: process.env.SUNO_COOKIE,
      "user-agent": process.env.SUNO_UA,
      origin: "https://suno.com",
      referer: "https://suno.com/",
    };

    console.log("uri:", uri);
    console.log("headers:", headers);
    const resp = await fetch(uri, {
      method: "POST",
      headers: headers,
    });

    if (resp.status === 200) {
      const data = await resp.json();
      if (data && data.jwt) {
        return data.jwt;
      }
    }

    console.log("get jwt token failed: ", resp);

    return "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3MzYyMzU4NjIsImZ2YSI6WzM4OTcsLTFdLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2NsZXJrX2lkIjoidXNlcl8ya0VOSXlaQ2ZiV05UcU95bUIyVlNFNGpUT2UiLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2VtYWlsIjoiY2Fsa2luenliam9nQGdtYWlsLmNvbSIsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvcGhvbmUiOm51bGwsImlhdCI6MTczNjIzNTgwMiwiaXNzIjoiaHR0cHM6Ly9jbGVyay5zdW5vLmNvbSIsImp0aSI6ImExMGYwNWNlZTVkYmE3NmU5MjkxIiwibmJmIjoxNzM2MjM1NzkyLCJzaWQiOiJzZXNzXzJyQVZjMUdNcjc2UWUxc09PRzRRc1BOMFVPSSIsInN1YiI6InVzZXJfMmtFTkl5WkNmYldOVHFPeW1CMlZTRTRqVE9lIn0.f8fUSdMc_XgyO29AE9W9IYEmEtrVNG8UzvUFkzYWWvsuNThq0U0s6QYcbpaUmgMAVDAPfRlAsObOmOuf0ZrhHLiynWyHKKHDWc2gkf5ljPiZhc9xvww3MupYbBQbPdj67O8sd_CFGmvEOt-nKVBsQTKqDjYuOErJKHEy0z7dIhVQxrLLVB7Pz_zGRjE7kAwCQMu4BMGYVErkF2-_e_vWU4ypdwXdlJ9jW7_rX_33-qTrA7HcgxZvNfX03hrzq5zK3UnMc7YdDuLjq6V-7UQDP_EzCOqZ8NAg4qJ1cMFOVQYkRlgF8dMJBzw9LjJFotEX-7OwfU32uKd11cbwNxTAIw";
  } catch (e) {
    console.log("get jwt token failed: ", e);
    return "";
  }
}

async function getReqHeaders(): Promise<any> {
  const userAgent = process.env.SUNO_UA;
  const token = await getJwtToken();
  // const token = "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3MzYyMzYzMTgsImZ2YSI6WzM5MDUsLTFdLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2NsZXJrX2lkIjoidXNlcl8ya0VOSXlaQ2ZiV05UcU95bUIyVlNFNGpUT2UiLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2VtYWlsIjoiY2Fsa2luenliam9nQGdtYWlsLmNvbSIsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvcGhvbmUiOm51bGwsImlhdCI6MTczNjIzNjI1OCwiaXNzIjoiaHR0cHM6Ly9jbGVyay5zdW5vLmNvbSIsImp0aSI6IjBiNjc3YTlkMGY2OTU0ODNjOTc3IiwibmJmIjoxNzM2MjM2MjQ4LCJzaWQiOiJzZXNzXzJyQVZjMUdNcjc2UWUxc09PRzRRc1BOMFVPSSIsInN1YiI6InVzZXJfMmtFTkl5WkNmYldOVHFPeW1CMlZTRTRqVE9lIn0.sVD5M5R5MntOvJ_fEJyj0TExxmxlPN2jOr8oYKmUV4Pk-u55W2IUhfQZa6SRsPg94MM5CK0lptmqCmWtlnBg_xQuDONzzlyqqRng9khBal0ByQv4B07xpBxNMRSoSZfl6ZdDGUIO6-Ky75-u_MyqCvWusmzx48aycpfTd3Bo1nhTS09E0EidS_1QxqfN0UIvbrFw3SwAxdfBsYi98JFCGLoGUh0yNQtMj_j5WFBQ8kqQ1ZQVgQnjCgeadWdfbdDdWb7tBQ-9MXsHayLI1gasKFj89SQ_7Zy5-dQjbSqBp5kEPtT3X8p5eViYL4BekgZM1LD0wrDL80xV4yfhQugbTw";

  const headers = {
    "user-agent": userAgent,
    origin: "https://suno.com",
    referer: "https://suno.com/",
    authorization: `Bearer ${token}`,
  };

  return headers;
}
