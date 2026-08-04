interface ApiErrorResponse {
  detail?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new ApiError("A variável VITE_API_URL não foi configurada.");
  }

  return baseUrl;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    return body.detail ?? `A API retornou o status ${response.status}.`;
  } catch {
    return `A API retornou o status ${response.status}.`;
  }
}

export async function apiGet<T>(
  path: string,
  params?: URLSearchParams,
): Promise<T> {
  const query = params?.toString();
  const url = `${getApiBaseUrl()}${path}${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new ApiError(await getErrorMessage(response), response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Não foi possível conectar à API.");
  }
}
