import React from 'react'

export default function Pagination() {
  return (
    <div className="flex items-center justify-end mt-2 gap-2">
                <button 
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30">
                    {"<"}
                </button>

                <button
                    onClick={() => {
                        table.nextPage();
                    }}
                    // disabled={!table.getCanNextPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30">
                    {">"}
                </button>

                <span className="flex items-center gap-1">
                    <div>Pagina</div>
                    {console.log(table.getPageCount(), "www")}
                    {/* <strong>{table.getState().pagination.pageIndex + 1} de {" "} {table.getPageCount()}</strong> */}
                    <strong>{table.getState().pagination.pageIndex + 1} de {" "} {data ? Math.ceil(data.total / 10) : 1}</strong>

                </span>

                <span className="flex items-center gap-1">
                    Ir a pagina:
                    <input 
                        type="number" 
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) -  1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16 bg-transparent"
                    />
                </span>
            </div>
  )
}
