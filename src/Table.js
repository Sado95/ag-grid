import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import spinner from "./spinner.gif";

/* AG GRID styles import */
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export const Table = () => {
  const [gridApi, setGridApi] = useState(null);

  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [hideColumn, setHideColumn] = useState(false);

  const rowSelectionType = "multiple";

  /* HEADER CONFIG FILE */

  const columnDefs = [
    {
      headerName: "Symbol",
      field: "symbol",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      floatingFilter: true,
    },
    {
      headerName: "Price Change",
      field: "priceChange",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Price Change Percent",
      field: "priceChangePercent",
      valueFormatter: percentageFormatter,
    },
    {
      headerName: "Weighted Average Price",
      field: "weightedAvgPrice",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Previous Close Price",
      field: "prevClosePrice",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Last Price",
      field: "lastPrice",
      valueFormatter: currencyFormatter,
    },
    { headerName: "Last Quantity", field: "lastQty" },
    {
      headerName: "Bid Price",
      field: "bidPrice",
      valueFormatter: currencyFormatter,
    },
    { headerName: "Bid Quantity", field: "bidQty" },
    {
      headerName: "Ask Price",
      field: "askPrice",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Ask Quantity",
      field: "askQty",
      valueFormatter: unitFormatter,
    },
    {
      headerName: "Open Price",
      field: "lowPrice",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "High Price",
      field: "highPrice",
      valueFormatter: currencyFormatter,
    },
    {
      headerName: "Low Price",
      field: "lowPrice",
      valueFormatter: currencyFormatter,
    },
    { headerName: "Volume", field: "volume" },
    { headerName: "Quote Volume", field: "quoteVolume" },
    {
      headerName: "Open Time",
      field: "openTime",
      valueFormatter: timeFormatter,
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Close Time",
      field: "closeTime",
      valueFormatter: timeFormatter,
      filter: "agDateColumnFilter",
    },
    { headerName: "First ID", field: "firstId" },
    { headerName: "Last ID", field: "lastId" },
    { headerName: "Count", field: "count" },
  ];

  /* FIELD FORMAT FUNCTIONS */

  function currencyFormatter(params) {
    return params.value + " €";
  }

  function percentageFormatter(params) {
    return params.value + " %";
  }

  function unitFormatter(params) {
    return params.value + " units";
  }

  function timeFormatter(params) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date(params.value));
  }

  /* *********************** */

  const defaultColDef = {
    sortable: true,
    editable: true,
    filter: true,
    resizable: true,
    width: 300,
    suppressSizeToFit: true,
  };

  const onGridReady = async (params) => {
    setGridApi(params);

    setGridColumnApi(params.columnApi);

    let result = await axios.get("https://data.binance.com/api/v3/ticker/24hr");

    params.api.applyTransaction({ add: result.data });

    // IF API WANTS TO START AT CERTAIN PAGE, APPLY THIS CODE SNIPPET
    /* params.api.paginationGoToPage(60); */
  };

  /* THIS BLOCK ALLOWS TO CREATE SMALL POPUP WINDOWS TO SHOW FULL PREVIEW OF SELECTED FILES */

  const onSelectionChanged = (event) => {
    console.log(event.api.getSelectedRows());
  };

  const onPaginationChange = (pageSize) => {
    gridApi.api.paginationSetPageSize(Number(pageSize));
  };

  const showColumn = () => {
    // IF GOAL IS TO HIDE SINGLE COLUMN, USE THIS SNIPPET OF CODE
    // gridColumnApi.setColumnVisible('dob',hideColumn)

    // IF GOAL IS TO HIDE MULTIPLE COLUMNS, USE THIS SNIPPET OF CODE
    gridColumnApi.setColumnsVisible(["symbol", "priceChange"], hideColumn);

    setHideColumn(!hideColumn);

    // TO FIT THE SIZE OF COLUMN
    gridApi.api.sizeColumnsToFit();
  };

  const onFilterTextChange = (e) => {
    gridApi.api.setQuickFilter(e.target.value);
  };

  const onExportClick = async () => {
    gridApi.api.exportDataAsCsv();
  };

  return (
    <div className="container-fluid">
      <h1 className="app-title">AG GRID DEMO</h1>

      <p style={{ fontWeight: "700", fontSize: "1.1em" }}>
        CLICK TO HIDE / SHOW COLUMNS{" "}
        <strong
          style={{ fontWeight: "700", fontSize: "1.2em", color: "black" }}
        >
          SYMBOL
        </strong>{" "}
        AND{" "}
        <strong
          style={{ fontWeight: "700", fontSize: "1.2em", color: "black" }}
        >
          PRICE CHANGE
        </strong>
      </p>

      <button
        onClick={showColumn}
        style={{ marginBottom: "2em" }}
        className="btn btn-outline-primary"
      >
        Toggle
      </button>

      <p style={{ fontWeight: "700", fontSize: "1.2em" }}>
        <strong>CHANGE AMOUNT OF UNITS SHOWN PER PAGE</strong>
      </p>

      <select
        onChange={(e) => onPaginationChange(e.target.value)}
        style={{ marginBottom: "2em", width: "250px" }}
        className="form-select"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="60">60</option>
        <option value="70">70</option>
        <option value="80">80</option>
        <option value="90">90</option>
        <option value="100">100</option>
      </select>

      <p style={{ fontWeight: "700", fontSize: "1.2em" }}>
        <strong>ENTER ANY RELEVANT TERM TO GET RESULTS</strong>
      </p>

      <div className="quicksearch-container">
        <input
          type="search"
          className="quicksearch"
          onChange={onFilterTextChange}
          placeholder="Search..."
        />
      </div>

      <div
        id="myGrid"
        className="ag-theme-alpine"
        style={{ height: "500px", width: "100%", marginBottom: "2em" }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection={rowSelectionType}
          onSelectionChanged={onSelectionChanged}
          rowMultiSelectWithClick={true}
          pagination={true}
          paginationPageSize={10}
          overlayLoadingTemplate={`<img src=${spinner}
            style={{
              width: "200px",
              height: "200px",
              margin: "auto",
              display: "block",
            }}
            alt="Loading..."
          />`}
          overlayNoRowsTemplate={
            '<span className="ag-overlay-loading-center">No data found to display.</span>'
          }
        />
      </div>

      <p style={{ fontWeight: "700", fontSize: "1.2em" }}>
        <strong>CLICK TO EXPORT TABLE DATA AS CSV FILE</strong>
      </p>

      <button
        onClick={() => onExportClick()}
        style={{ marginBottom: "2em" }}
        className="btn btn-outline-primary"
      >
        EXPORT
      </button>
    </div>
  );
};
