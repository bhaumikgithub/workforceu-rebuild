'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  IGetRowsParams,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  status: string;
  clientId: string;
  companyType: string;
  businessType: string;
}

export default function PublicUsersPage() {
  const [gridApi, setGridApi] = useState<any>(null);
  const [search, setSearch] = useState('');

  const columns: ColDef<User>[] = [
    { headerName: 'First Name', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true },
    { headerName: 'Company Type', field: 'companyType', sortable: true, filter: true },
    { headerName: 'Business Type', field: 'businessType', sortable: true, filter: true },
    { headerName: 'Client ID', field: 'clientId', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'User Type', field: 'userType', sortable: true, filter: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true },
  ];

  // datasource for infinite scrolling
  const datasource = useCallback(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        try {
          const pageSize = params.endRow - params.startRow;
          const page = Math.floor(params.startRow / pageSize) + 1;

          const sortField = params.sortModel?.[0]?.colId || 'firstName';
          const sortOrder = params.sortModel?.[0]?.sort || 'asc';

          const res = await axios.get('/api/admin/publicUsers', {
            params: { page, pageSize, search, sortField, sortOrder },
          });

          params.successCallback(res.data.data, res.data.total);
        } catch (err) {
          console.error('Error fetching rows:', err);
          params.failCallback();
        }
      },
    }),
    [search]
  );

  const onGridReady = (params: GridReadyEvent<User>) => {
    setGridApi(params.api);

    // set datasource initially
    (params.api as any).setGridOption('datasource', datasource());

    // default sort
    (params.api as any).setSortModel([{ colId: 'firstName', sort: 'asc' }]);
  };

  // when search changes, re-attach datasource and reset to page 1
  useEffect(() => {
    if (gridApi) {
      (gridApi as any).setGridOption('datasource', datasource());
      gridApi.refreshInfiniteCache();
    }
  }, [search, datasource, gridApi]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Public Users</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border px-2 py-1 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ag-theme-alpine" style={{ width: '100%', height: 600 }}>
        <AgGridReact<User>
          columnDefs={columns}
          rowModelType="infinite"
          cacheBlockSize={50}
          pagination={true}
          paginationPageSize={50}
          onGridReady={onGridReady}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
