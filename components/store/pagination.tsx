"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function StorePagination({
  currentPage,
  totalPages,
  className,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/store?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            size="default"
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* First Page */}
        <PaginationItem>
          <PaginationLink
            href={createPageURL(1)}
            isActive={currentPage === 1}
            size="default"
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis Start */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Middle Pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => page !== 1 && page !== totalPages)
          .filter((page) => Math.abs(currentPage - page) <= 1)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                size="default"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis End */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last Page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href={createPageURL(totalPages)}
              isActive={currentPage === totalPages}
              size="default"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            size="default"
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
