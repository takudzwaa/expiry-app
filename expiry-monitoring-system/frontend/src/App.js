import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Paper, Button } from '@mui/material';
import { Add as AddIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import Reports from './Reports';
import ManageItems from './ManageItems';

const App = () => {
    return (
        <Router>
            <Container>
                <Box my={4}>
                    <Paper>
                        <Box p={2}>
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} href="/manage-items">
                                Manage Items
                            </Button>
                            <Button variant="contained" color="secondary" startIcon={<AssessmentIcon />} href="/reports">
                                Reports
                            </Button>
                            <Routes>
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/manage-items" element={<ManageItems />} />
                            </Routes>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Router>
    );
};

export default App;