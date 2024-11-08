import { API_URL } from '../config';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

export async function fetchBlogs() {
  try {
    const response = await fetch(`${API_URL}/api/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });
    return handleResponse(response);
  } catch (error) {
    return { 
      data: null, 
      error: 'Unable to connect to the server. Please check your internet connection.' 
    };
  }
}

export async function fetchBlogBySlug(slug: string) {
  try {
    const response = await fetch(`${API_URL}/api/blogs/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });
    return handleResponse(response);
  } catch (error) {
    return { 
      data: null, 
      error: 'Unable to connect to the server. Please check your internet connection.' 
    };
  }
}