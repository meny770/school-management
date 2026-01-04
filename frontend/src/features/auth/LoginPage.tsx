import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useStore } from '../../stores/RootStore';

const LoginPage = observer(() => {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authStore.login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                School Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teacher Portal
              </Typography>
            </Box>

            {authStore.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {authStore.error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={authStore.loading}
              >
                {authStore.loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                Teacher: teacher@school.com / teacher123
              </Typography>
              <Typography variant="caption" display="block">
                Admin: admin@school.com / admin123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
});

export default LoginPage;

