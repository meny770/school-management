import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as AttendanceIcon,
  Grade as GradeIcon,
  Event as EventIcon,
  Description as ReportIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useStore } from '../../stores/RootStore';

const drawerWidth = 240;

const DashboardLayout = observer(() => {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
    { text: 'Grades', icon: <GradeIcon />, path: '/grades' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Report Cards', icon: <ReportIcon />, path: '/report-cards' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            School Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{authStore.user?.name}</Typography>
            <Avatar sx={{ width: 32, height: 32 }}>
              {authStore.user?.name.charAt(0)}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
});

export default DashboardLayout;

