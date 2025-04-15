import { useState, useEffect, useCallback } from "react";

export interface SearchResult {
  _id: string;
  code: string;
  title: string;
  degree_name: string;
  semester: string;
}

// const fetchSearchResults = async (searchTerm: string): Promise<SearchResult[]> => {
//   console.log("Fetching search results for search term", searchTerm);
//   // Fetch search results from the server
//   const response = await fetch(`http://localhost:8000/course/search?q=${encodeURIComponent(searchTerm)}`);
//   if (!response.ok) {
//     throw new Error(`Search failed for term ${searchTerm}`);
//   }

//   const results: SearchResult[] = await response.json();
//   console.log("Search results fetched successfully", results);
//   return results;
// };

// export const useSearch = (searchTerm: string) => {
//   return useQuery<SearchResult[], Error>({
//     queryKey: ["search"],
//     queryFn: () => fetchSearchResults(searchTerm),
//   });
// };

export const useSearch = (
  initialTerm?: string,
  limit?: number,
  degree?: string | null
) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const searchItems = useCallback(
    async (term: string, limit: number, degree?: string | null) => {
      setSearchTerm(term);
      if (!term.trim()) {
        setResults([]);
        return;
      }
      if (!limit) {
        limit = 10;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Construct URL with query parameters
        let url = `https://rate-my-course-node-cuexa.ondigitalocean.app/course/search?q=${encodeURIComponent(
          term
        )}&limit=${limit}`;
        // Add degree filter if provided
        if (degree) {
          url += `&degree=${encodeURIComponent(degree)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }
        const data: SearchResult[] = await response.json();
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while searching"
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (initialTerm && limit) {
      searchItems(initialTerm, limit, degree);
    }
  }, [initialTerm, limit, degree, searchItems]);

  return {
    data: results,
    isLoading,
    error,
    searchItems,
    searchTerm,
  };
};
