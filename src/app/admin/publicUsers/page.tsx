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
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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

          console.log('Fetching rows:', { page, pageSize, search, sortField, sortOrder });

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

    // ✅ attach datasource once on init
    (params.api as any).setGridOption('datasource', datasource());
  };

  // ✅ when search changes, reset datasource completely
  useEffect(() => {
    if (gridApi) {
      gridApi.setGridOption('datasource', datasource());
    }
  }, [search, datasource, gridApi]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Public Users</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search"
          className="border px-2 py-1 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          onClick={() => router.push('/admin/publicUsers/create')}
        >
          Add New
        </button>
      </div>

      <div className="ag-theme-alpine" style={{ width: '100%', height: 600 }}>
        <AgGridReact<User>
          columnDefs={columns}
          rowModelType="infinite"
          cacheBlockSize={50}
          maxBlocksInCache={1}
          rowBuffer={0}                         
          maxConcurrentDatasourceRequests={1}
          pagination={true}
          paginationPageSize={50}
          onGridReady={onGridReady}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
