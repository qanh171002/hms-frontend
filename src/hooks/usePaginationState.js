import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginationState = (pageParamName = "page", defaultPage = 1) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get(pageParamName)) || defaultPage;
  const [currentPage, setCurrentPageState] = useState(pageFromUrl);

  useEffect(() => {
    const newPageFromUrl =
      parseInt(searchParams.get(pageParamName)) || defaultPage;
    setCurrentPageState(newPageFromUrl);
  }, [searchParams, pageParamName, defaultPage]);

  const setCurrentPage = useCallback(
    (newPage) => {
      const actualPage =
        typeof newPage === "function" ? newPage(currentPage) : newPage;

      const newSearchParams = new URLSearchParams(searchParams);
      if (actualPage === defaultPage) {
        newSearchParams.delete(pageParamName);
      } else {
        newSearchParams.set(pageParamName, actualPage.toString());
      }

      setSearchParams(newSearchParams, { replace: true });

      setCurrentPageState(actualPage);
    },
    [searchParams, setSearchParams, pageParamName, defaultPage, currentPage],
  );

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(defaultPage);
  }, [setCurrentPage, defaultPage]);

  return {
    currentPage,
    setCurrentPage,
    resetToFirstPage,
  };
};
