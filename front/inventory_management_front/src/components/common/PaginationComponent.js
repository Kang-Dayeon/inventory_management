import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationComponent = ({serverData, moveToPage, pageName}) => {
  return (
    <div className='d-flex justify-content-center'>
      <Pagination aria-label="Page navigation">

        {/* prev */}
        <PaginationItem>
          <PaginationLink
            first
            href='#'
          />
        </PaginationItem>

        {serverData.prev ? (
          <PaginationItem>
            <PaginationLink
              onClick={() => moveToPage(pageName, {page: serverData.prevPage})}
              previous
            />
          </PaginationItem>
        ):(
          <PaginationItem disabled>
            <PaginationLink
              href="#"
              previous
            />
          </PaginationItem>
        )}

        {/* page list */}
        {serverData.pageNumList.map((pageNum) => (
          <PaginationItem key={pageNum} active={serverData.current === pageNum}>
            <PaginationLink onClick={() => moveToPage(pageName, {page: pageNum})}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* next */}
        {serverData.nextPage ? (
        <PaginationItem>
          <PaginationLink
            onClick={() => moveToPage(pageName, {page: serverData.nextPage})}
            next
          />
        </PaginationItem>
        ):(
        <PaginationItem　disabled>
          <PaginationLink
            href="#"
            next
          />
        </PaginationItem>
        )}
        <PaginationItem>
        <PaginationLink
          href="#"
          last
        />
        </PaginationItem>
        </Pagination>
      </div>
  );
};

export default PaginationComponent;