import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Container, MenuItem } from '@mui/material';
import { addDoc, collection, doc, getFirestore, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

const steps = ['Personal Details', 'Contact Details', 'Job Details', 'Review & Submit'];

export default function EmployeeStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        display_name: '',
        gender: '',
        DOB: '',
        work_email: '',
        email: '',
        phone_number: '',
        job_title: '',
        department: '',
        type: '',
        level: '',
        DOJ: '',
        location: '',
        salary: '',
        frequency: '',
        supervisor: '',
        shift: '',
        leaves: { annual: '', sick: '' },
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'annual' || name === 'sick') {
            setFormData({
                ...formData,
                leaves: {
                    ...formData.leaves,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prevStep => prevStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevStep => prevStep - 1);
        }
    };

    const handleSubmit = async () => {
        alert(JSON.stringify(formData, null, 2));
        const db = getFirestore();
        const docRef = await addDoc(collection(db, "employees"), formData);
        console.log("Document written with ID: ", docRef.id);
    };




    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className='grid grid-cols-2 gap-4'>
                        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} margin="normal" />
                        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} margin="normal" />

                        <TextField label="Display Name" name="display_name" value={formData.display_name} onChange={handleChange} margin="normal" />
                        <TextField label="Gender" name="gender" value={formData.gender} onChange={handleChange} margin="normal" select>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>

                        <TextField label="Date of Birth" name="DOB" type="date" value={formData.DOB} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
                    </div>
                );
            case 1:
                return (
                    <div className='grid grid-cols-2 gap-4'>
                        <TextField label="Work Email" name="work_email" value={formData.work_email} onChange={handleChange} margin="normal" />
                        <TextField label="Personal Email" name="email" value={formData.email} onChange={handleChange} margin="normal" />

                        <TextField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} margin="normal" />
                    </div>
                );
            case 2:
                return (
                    <div className='grid grid-cols-2 gap-4 h-[60vh] overflow-y-scroll'>
                        <TextField label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} margin="normal" />
                        <TextField label="Department" name="department" value={formData.department} onChange={handleChange} margin="normal" />

                        <TextField label="Employee Type" name="type" value={formData.type} onChange={handleChange} margin="normal" />
                        <TextField label="Employee Level" name="level" value={formData.level} onChange={handleChange} margin="normal" />

                        <TextField label="Date of Joining" name="DOJ" type="date" value={formData.DOJ} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
                        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} margin="normal" select>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="remote">Remote</MenuItem>
                        </TextField>

                        <TextField label="Salary" name="salary" value={formData.salary} onChange={handleChange} margin="normal" />
                        <TextField label="Frequency" name="frequency" value={formData.frequency} onChange={handleChange} margin="normal" select>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="hourly">Hourly</MenuItem>
                        </TextField>

                        <TextField label="Supervisor" name="supervisor" value={formData.supervisor} onChange={handleChange} margin="normal" />
                        <TextField label="Shift" name="shift" value={formData.shift} onChange={handleChange} margin="normal" select>
                            <MenuItem value="day">Day</MenuItem>
                            <MenuItem value="night">Night</MenuItem>
                        </TextField>

                        <TextField label="Annual Leaves" name="annual" value={formData.leaves.annual} onChange={handleChange} margin="normal" />
                        <TextField label="Sick Leaves" name="sick" value={formData.leaves.sick} onChange={handleChange} margin="normal" />

                        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" />
                    </div>
                );
            case 3:
                return (
                    <>
                        <Typography variant="h6" sx={{ mb: 2 }}>Review Your Details:</Typography>
                        <Box className="h-[60vh] overflow-y-scroll" sx={{ p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                            {formData && Object.keys(formData).length > 0 ? (
                                Object.entries(formData).map(([key, value]) => (
                                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {key}:
                                        </Typography>
                                        <Typography variant="body1">
                                            {typeof value === 'object' ? JSON.stringify(value) : value}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No details to display.
                                </Typography>
                            )}
                        </Box>
                    </>
                );
            default:
                return 'Unknown step';
        }
    };


    return (
        <Container maxWidth="2xl">
            <Box sx={{ width: '100%', mt: 4 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ mt: 4 }}>
                    {getStepContent(activeStep)}
                    <Box sx={{ mt: 2 }}>
                        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" onClick={handleSubmit}>
                                Submit
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
