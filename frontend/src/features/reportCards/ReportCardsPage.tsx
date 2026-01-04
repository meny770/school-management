import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const ReportCardsPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Report Cards</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Report Card
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6" gutterBottom>
          Report Cards feature coming soon
        </Typography>
        <Typography>
          Create semester/annual report cards with subject grades and comments.
          Save as draft and publish when ready for students and parents.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportCardsPage;

