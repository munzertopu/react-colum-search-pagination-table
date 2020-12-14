/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import axios from "axios";
import _ from "lodash";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  container: {
    padding: "40px 0px",
  },
  lightRow: {
    backgroundColor: "rgba(0,0,0,.05)",
  },
  greyRow: {
    background: "#fff",
  },
});

const initialHeadCells = [
  {
    name: "id",

    label: "ID",
  },
  {
    name: "name",

    label: "Name",
  },
  {
    name: "district",

    label: "District",
  },
];

export default function SearchPaginationTable() {
  const classes = useStyles();

  const [headCells] = useState(initialHeadCells);

  const [params, setParams] = useState({
    page: 1,
    per_page: 15,
  });
  const [currentPage, setCurrentPage] = useState(0);

  // END Related to Page
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");

  let history = useHistory();

  useEffect(() => {
    getUserList();
  }, [params]);

  async function getUserList() {
    // setOpenBackDrop(true);
    axios
      .get("https://heal-holmes.com/api/api/police-stations", {
        params: params,
      })
      .then((response) => {
        setData(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setTotalPage(response.data.data.total);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  function handleChangePage(event, page) {
    setParams({ ...params, page: page + 1 });
  }

  function handleChangeRowsPerPage(event) {
    let perPageRow = event.target.value;
    setParams({ ...params, per_page: perPageRow });
  }

  function handleRequestSort(event, property) {
    const isAsc = orderBy === event && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(event);
    const sortString = isAsc ? ".1" : ".-1";
    setParams({ ...params, sort_by: event + sortString });
  }
  const handleColumnWiseSearch = _.debounce((inputValue, column) => {
    const paramState = { ...params };
    if (_.isEmpty(inputValue)) {
      delete paramState[column];
    } else {
      paramState[column] = inputValue;
    }
    paramState.page = 1; // This is for resolving the columwise search & pagination bug.
    setParams(paramState);
  }, 500);

  const handleRowClick = (row) => {
    history.push(`row-details/${row.id}`);
  };

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <TableContainer>
                <Table
                  className={`${classes.table}`}
                  aria-label="Columns searching, Pagination"
                >
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell, index) => (
                        <TableCell
                          key={headCell.name}
                          sortDirection={
                            orderBy === headCell.name ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === headCell.name}
                            direction={
                              orderBy === headCell.name ? order : "asc"
                            }
                            onClick={() => handleRequestSort(headCell.name)}
                          >
                            {headCell.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {headCells.map((obj, index) => (
                        <TableCell key={index}>
                          <TextField
                            key={index}
                            align="left"
                            onChange={(e) =>
                              handleColumnWiseSearch(e.target.value, obj.name)
                            }
                            id="standard-basic"
                            label={obj.label}
                          />
                        </TableCell>
                      ))}
                    </TableRow>

                    {data.map((row, index) => (
                      <TableRow
                        key={index}
                        onClick={(event) => handleRowClick(row)}
                        style={{ cursor: "pointer" }}
                        className={
                          index % 2 ? classes.greyRow : classes.lightRow
                        }
                      >
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.district}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 15, 30, 50]}
                component="div"
                count={totalPage}
                rowsPerPage={params.per_page}
                page={currentPage === 0 ? currentPage : currentPage - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
