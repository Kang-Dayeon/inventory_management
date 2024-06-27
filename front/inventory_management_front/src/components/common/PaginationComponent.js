import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationComponent = ({serverData, moveToPage, pageName}) => {
  return (
    <div className='d-flex justify-content-center'>
      <Pagination aria-label="Page navigation">

        {/* prev */}
        {serverData.prev ? (
          <PaginationItem>
            <PaginationLink
              first
              onClick={() => moveToPage(pageName, {page: serverData.prevPage})}
            />
          </PaginationItem>
        ):(
          <PaginationItem disabled>
            <PaginationLink
              first
            />
          </PaginationItem>
        )}
        

        {serverData.current === 0 ? (
          <PaginationItem disabled>
            <PaginationLink
              previous
            />
          </PaginationItem>
        ):(
          <PaginationItem>
            <PaginationLink
              onClick={() => moveToPage(pageName, {page: serverData.current - 1})}
              previous
            />
          </PaginationItem>
        )}

        {/* page list */}
        {serverData.pageNumList?.map((pageNum) => (
          <PaginationItem key={pageNum} active={serverData.current === pageNum}>
            <PaginationLink onClick={() => moveToPage(pageName, {page: pageNum})}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* next */}
        {serverData.totalPage === serverData.current ? (
          <PaginationItem　disabled>
            <PaginationLink
              next
            />
          </PaginationItem>
        ):(
          <PaginationItem>
            <PaginationLink
              onClick={() => moveToPage(pageName, {page: serverData.current + 1})}
              next
            />
          </PaginationItem>
        )}

        {serverData.next ? (
          <PaginationItem>
            <PaginationLink
              onClick={() => moveToPage(pageName, {page: serverData.nextPage})}
              last
            />
          </PaginationItem>
        ):(
          <PaginationItem disabled>
            <PaginationLink
              last
            />
          </PaginationItem>
        )}

        
        </Pagination>
      </div>
  );
};

export default PaginationComponent;