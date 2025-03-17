import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Avatar, Modal, Fade, Backdrop, Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActions } from '@mui/material';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from "../App/firebase"
import { loginFailure, loginSuccess } from '../features/auth/authSlice';
import { green } from '@mui/material/colors';
import EmployeeFormModal from './EmployeeFormModal';
import { addDoc, collection, doc, getFirestore, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

const auth = getAuth(app);

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [employees, setEmployees] = useState([]);
  console.log("isAuthenticated: ", isAuthenticated);

  // useEffect(() => {
  //     if (isAuthenticated) {
  //         toast.success("Logged In Successfully");
  //     } else {
  //         toast.error("Logged In Failed");
  //         navigate('/signin');
  //     }
  // }, [isAuthenticated, navigate]);  // Make sure to include `isAuthenticated` and `navigate` in the dependency array

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Hello " + user.email);
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        console.log("You are Logged Out!");
        dispatch(loginFailure());
        navigate('/signin');
      }
    });
  }, [dispatch]);

  useEffect(() => {
    function getEmployees() {
      const db = getFirestore(app);
      const employeesRef = collection(db, "employees");
      getDocs(employeesRef).then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          setEmployees((prevEmployees) => [...prevEmployees, doc.data()]);
        });
      });
    }
    getEmployees();
  }, [])
  // console.log(employees)
  return (
    <div>
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <EmployeeFormModal />
        <div className='w-full flex justify-center items-center'>
          <Box sx={{ display: "flex", flexFlow: "wrap", flexDirection: "row", height: '80vh', marginY: '30px', padding: "20px", overflow:"scroll", marginLeft:"60px" }}>
            {
              employees.map((employee, index) => {
                return (
                  <EmployeeCard key={index} employee={employee} />
                );
              })
            }
          </Box>
        </div>
      </Container>
      <Toaster />
    </div>
  )
}

function EmployeeCard({ employee }) {  // Properly destructuring the employee prop
  return (
    <div>
      <Card sx={{ width: 280, height: 300, borderRadius: '12px', boxShadow: 3, margin: '20px', display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ bgcolor: '#f0f0f0', p: 3, display: 'flex', justifyContent: 'center', alignItems: "between" }}>
          <Avatar
            // src="https://i.pravatar.cc/150"
            alt="Profile Picture"
            sx={{ width: 100, height: 100, border: '4px solid white' }}
          />
        </Box>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {employee.first_name} {employee.last_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            📧 : {employee.email}
          </Typography>
          <EmployeeDetailModal employee={employee} />
        </CardContent>
      </Card>
    </div>
  )
}



function EmployeeDetailModal({ employee }) {  // Receive employee as a prop
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'white',
    boxShadow: 24,
  };

  return (
    <div>
      <Button onClick={handleOpen} variant='contained'>See Details</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 500 },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {/* Header with profile picture and name */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: "#1976D2",
                color: 'white',
                p: 2,
              }}
            >
              <Avatar
                alt={employee?.first_name + " " + employee?.last_name}
                src={employee?.photoURL || "https://via.placeholder.com/150"}
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {employee?.first_name} {employee?.last_name}
              </Typography>
            </Box>

            {/* Contact Details */}
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                CONTACT DETAILS
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">{employee?.email || "N/A"}</Typography>
                <Typography variant="body2">{employee?.phone || "N/A"}</Typography>
              </Box>

              {/* Job Title and Business Unit */}
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                LOCATION
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">JOB TITLE</Typography>
                  <Typography variant="body1">{employee?.job_title || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">SECONDARY TITLE</Typography>
                  <Typography variant="body1">{employee?.secondary_title || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">DEPARTMENT</Typography>
                  <Typography variant="body1">{employee?.department || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">BUSINESS UNIT</Typography>
                  <Typography variant="body1">{employee?.business_unit || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}


