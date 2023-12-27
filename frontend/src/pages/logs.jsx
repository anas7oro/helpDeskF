import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogs } from '../features/logs/logsSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import Header from "../components/Header";


function Logs() {
    const dispatch = useDispatch(getLogs);
    const logs = useSelector(state => state.logs.logs);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getLogs());
    }, [dispatch]);

    const goBack = () => {
        navigate(-1);
    }

    return (
        
        <div className="container mt-4">
            <Header />
            
            <Button variant="secondary" onClick={goBack}>Back</Button>
            {logs && (
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Error Message</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...logs]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((log, index) => (
                                <tr key={index}>
                                    <td>{log.userId ? log.userId : 'Guest'}</td>
                                    <td>{log.errorMessage}</td>
                                    <td>{log.createdAt}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default Logs;