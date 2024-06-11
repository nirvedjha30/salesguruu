import React, { useState } from 'react';
import Pagination from './Pagination';

const TableWithPagination = ({ data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = data.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChanged = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              {/* Render additional table data if needed */}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChanged={onPageChanged}
      />
    </div>
  );
};

export default TableWithPagination;





import React from 'react';
import TableWithPagination from './TableWithPagination';

const MainComponent = () => {
  // Sample data
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'Alice Smith', email: 'alice@example.com' },
    // Add more sample data as needed
  ];

  const itemsPerPage = 5; // Number of items to display per page

  return (
    <div>
      <h1>Table with Pagination</h1>
      <TableWithPagination data={data} itemsPerPage={itemsPerPage} />
    </div>
  );
};

// export default MainComponent;
