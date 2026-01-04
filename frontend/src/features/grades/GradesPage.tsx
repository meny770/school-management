import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const GradesPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Grades & Comment Templates</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Grade
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Grades feature coming soon
        </Typography>
        <Typography>
          Enter grades with numerical values (1-100), "meets expectations" scale (1-5),
          select comment templates, and add custom notes for strengths and improvements.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GradesPage;

