/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
export default function RowDetails(props) {
  const paramID = props.match.params.id;
  const [rowDetails, setRowDetails] = useState({});

  useEffect(() => {
    getRowDetails();
  }, []);

  async function getRowDetails() {
    axios
      .get(`https://heal-holmes.com/api/api/police-stations/${paramID}`)
      .then((response) => {
        setRowDetails(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  return (
    <div>
      {" "}
      <Paper variant="outlined" square>
        <p>
          {" "}
          <span style={{ fontWeight: "bold" }}> ID : </span> {rowDetails.id}
        </p>
        <p>
          {" "}
          <span style={{ fontWeight: "bold" }}>
            {" "}
            Police Station Name :{" "}
          </span>{" "}
          {rowDetails.name}
        </p>
        <p>
          {" "}
          <span style={{ fontWeight: "bold" }}> District : </span>{" "}
          {rowDetails.district}
        </p>
      </Paper>
    </div>
  );
}
