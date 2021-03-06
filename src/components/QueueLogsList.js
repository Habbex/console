import React from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';

import DisplayDate from '../components/DisplayDate';

const QueueLogsList = ({ items, pagination, loadPage }) => {
  const onDisclose = (doc) => console.log(doc);
  const onPageChange = (evt, offset) => loadPage(offset - 1);

  return (
    <div style={{ marginTop: 40 }}>
      <div
        style={{
          marginBottom: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant="h4" component="h2">
          Logs
        </Typography>
        <Pagination
          count={Math.ceil(pagination.count / pagination.limit)}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          page={pagination.offset + 1}
          onChange={onPageChange}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>message</TableCell>
              <TableCell>refId</TableCell>
              <TableCell>details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((log) => {
              return (
                <TableRow key={log.id} onClick={() => onDisclose(log)}>
                  <TableCell>
                    <DisplayDate date={log.createdAt} />
                  </TableCell>
                  <TableCell>{log.subject}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.refId}</TableCell>
                  <TableCell>{JSON.stringify(log.details, null, 2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ marginTop: 15, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Pagination
          count={Math.ceil(pagination.count / pagination.limit)}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          page={pagination.offset + 1}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default QueueLogsList;
