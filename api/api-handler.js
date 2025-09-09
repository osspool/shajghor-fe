// "server-only";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Validate BASE_URL
if (!BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

// const getApiUrl = (endpoint) => {
//   if (typeof window !== 'undefined') {
//     // In browser, use the proxy route
//     return `/api/proxy${endpoint}`;
//   }
//   // On server, use direct API URL
//   return `${BASE_URL}${endpoint}`;
// };


export async function handleApiRequest(
  method,
  endpoint,
  options = {},
  debug = false
) {
  const {
    body,
    token,
    revalidate,
    headerOptions,
    tags,
    cache, // 'force-cache'  'no-store'
  } = options;

  // console.log("endpoint", endpoint)

  try {
    let headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Only set 'Content-Type' to json if the body is not a FormData object
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (headerOptions) {
      headers = { ...headers, ...headerOptions };
    }

    const fetchOptions = {
      method,
      headers,
      ...(body && {
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    };

    // Add Next.js specific options when on server
    if (cache) {
      fetchOptions.cache = cache;
    }
    if (revalidate !== undefined) {
      fetchOptions.next = {
        ...fetchOptions.next,
        revalidate,
      };
    }
    if (tags) {
      fetchOptions.next = {
        ...fetchOptions.next,
        tags,
      };
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const res = await response.json() || null 
      throw new Error(res?.message || response.statusText);
    }

    // Detect response type based on content type header
    const contentType = response.headers.get("Content-Type");

    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("application/pdf") || contentType?.includes("image/")) {
      const pdf_data = await response.blob(); // Handles binary data such as PDF or images
      data = {
        data: pdf_data,
        response
      }
    } else if (contentType?.includes("text/csv")) {
      const csv_data = await response.blob();
      data = {
        data: csv_data,
        response
      }
    } else if (contentType?.includes("text/")) {
      // Handle text content types
      const text = await response.text();
      data = {
        data: text,
        response
      }
    } else {
      // For unknown content types, try blob first, fallback to text
      try {
        const blob = await response.clone().blob();
        data = {
          data: blob,
          response
        }
      } catch {
        const text = await response.text();
        data = {
          data: text,
          response
        }
      }
    }

    if (debug) console.log("API Response:", data);

    return data; // Include raw response object
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw new Error(error.message || "An error occurred while fetching data.");
  }
}


export { BASE_URL };