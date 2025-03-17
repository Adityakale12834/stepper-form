import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { loginFailure, loginStart, loginSuccess } from '../features/auth/authSlice';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import { app } from "../app/firebase";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    console.log(isAuthenticated);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()

    const signUpWithGoogle = () => {
        dispatch(loginStart());

        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
    
                dispatch(loginSuccess({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }));
    
                // toast.success("Signed up with Google!");
                navigate('/');
            })
            .catch((error) => {
                dispatch(loginFailure(error.message));
                toast.error("Google Sign-Up Failed");
            });    
    };

    const signUpUser = async (data) => {
        const { username, password } = data;

        dispatch(loginStart());

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            dispatch(loginSuccess({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            }));

            toast.success('Successfully signed in!');
        } catch (error) {
            dispatch(loginFailure(error.message));
            toast.error('Invalid username or password.');
        }
    };

    useEffect(() => {
        if(isAuthenticated) navigate("/");
    },[]);

    // const handleSignIn = (data) => {
    //     const { username, password } = data;
    //     console.log(username, password);
    //     dispatch(login());
    //     toast.success('Successfully signed in!');
    //     // if (username === 'admin' && password === 'password') {
    //     //     dispatch(login());
    //     //     toast.success('Successfully signed in!');
    //     // } else {
    //     //     toast.error('Invalid username or password.');
    //     // }
    // };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ p: 4, mt: 20, borderRadius: 2 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit(signUpUser)}>
                    <Box mb={3}>
                        <TextField
                            label="email"
                            fullWidth
                            variant="outlined"
                            {...register('email', { required: 'email is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Box>
                    <Box mb={3}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </form>
                <Button onClick={signUpWithGoogle} className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-gray-100 transition">
                    <FcGoogle className="text-2xl" />
                </Button>
                {isAuthenticated && (
                    <Typography color="success.main" align="center">
                        You are logged in!
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default SignIn;
