import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Loading from '@/components/Loading';
import {useSale, useShowSale, useFetchPaymentTypes } from '../../hooks/useSale';
import moment from 'moment';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import { Sale } from '../../models/sale.domain.type';
import { HeaderSaleAdapter } from '../../adapter';
import { generateTicket } from '../SaleShow/saleTicket';
import { generateQuotePdf } from '../SaleShow/saleQuotePdf';
import { Company } from '@/modules/auth/models/login.domain.type';
import { RootState } from '@/redux/store';

const ListOfSales: React.FC = () => {
    const navigate = useNavigate();
    
    const {
        sales,
        totalSale,
        isLoading,
        paginationModel,
        handlePaginationModelChange,
    } = useSale();

    const company: Company = useSelector((state: RootState) => state.auth.user.company);

    const { data: paymentTypeOptions = [] } = useFetchPaymentTypes();

    const [ticketSaleId, setTicketSaleId] = useState<string | null>(null);
    const [ticketIsQuote, setTicketIsQuote] = useState(false);

    const { data: showSaleData } = useShowSale(ticketSaleId ?? '', ticketSaleId !== null);

    useEffect(() => {
        if (!ticketSaleId || !showSaleData) return;

        const adaptedData = HeaderSaleAdapter(showSaleData.data);
        const paymentTypeName = paymentTypeOptions.find(p => p.value === adaptedData.pay.idPaymentType)?.label ?? '';

        if (ticketIsQuote) {
            generateQuotePdf(adaptedData, paymentTypeName, company);
        } else {
            generateTicket(adaptedData, paymentTypeName, company);
        }

        setTicketSaleId(null);
    }, [ticketSaleId, showSaleData, paymentTypeOptions, ticketIsQuote, company]);

    const handleShowBuy = (sale: Sale) => {
            // dispatch(editCategory(category));
            navigate(`${sale.id}/show`)
        };

    const handlePrint = (sale: Sale) => {
        if (!sale.id) return;
    

        const isCoti = sale.typeOfSale?.name === 'Cotizacion';
        //setTicketIsQuote(sale.isQuote);
        setTicketIsQuote(isCoti);
        setTicketSaleId(String(sale.id));
    };


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Codigo',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'date',
            headerName: 'Fecha',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{moment(params.value).format("DD/MM/YYYY")}</>,
        },
        {
            field: 'typeOfSale',
            headerName: 'Tipo',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.row.typeOfSale.name}</>,
        },
        {
            field: 'name',
            headerName: 'Cliente',
            flex: 1,
            renderCell: (params: GridRenderCellParams) =>  <>{params.value}</>,
        },
        {
            field: 'address',
            headerName: 'Dirección',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'total',
            headerName: 'Total',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => <>{params.value}</>,
        },
        {
            field: 'actions',
            type: 'actions',
            sortable: false,
            headerName: 'Acciones',
            width: 260,
            renderCell: (params: GridRenderCellParams) => {
                const sale = params.row as Sale;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => handleShowBuy(sale)}
                        >
                            Detalle
                        </Button>
                        <Tooltip title={sale.typeOfSale.name === "Cotizacion" ? 'Generar ticket' : 'Generar PDF'}>
                            <IconButton
                                color="success"
                                size="small"
                                onClick={() => handlePrint(sale)}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
    ];

    
    if (isLoading) {
        return <Loading loading={isLoading}/>;
    }

    return (
        <Box sx={{ width: '100%' }}>


        <DataGrid
            rows={sales}
            rowCount={totalSale}
            columns={columns}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0
                ? 'even-row'
                : 'odd-row'
            }
            disableColumnSelector
            disableRowSelectionOnClick
            autoHeight
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: paginationModel.pageSize,
                        page: paginationModel.page,
                    },
                },
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[paginationModel.pageSize]}
            //getRowId={(row: Sale) => row.id}
            paginationMode="server"
        />
                </Box>
    );
};

export default ListOfSales;


