'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Box, CircularProgress, AppBar, Toolbar, Button, Switch } from '@mui/material';
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import db from '@/firebase';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function Result() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const { isSignedIn, user, isLoaded } = useUser();
    const [darkMode, setDarkMode] = useState(false);

    const setAccountStatus = async () => {
        if (isSignedIn) {
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                await setDoc(docRef, { accountStatus: "PRO" }, { merge: true });
            }
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return;
            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
                const sessionData = await res.json();
                if (res.ok) {
                    setSession(sessionData);
                    // Only attempt to update account status if the session is loaded and payment is successful
                    if (isLoaded && sessionData.payment_status === "paid") {
                        await setAccountStatus();
                    }
                } else {
                    setError(sessionData.error);
                }
            } catch (err) {
                setError('An error occurred while retrieving the session.');
            } finally {
                setLoading(false);
            }
        };
        fetchCheckoutSession();
    }, [session_id, isLoaded,setAccountStatus]);

    const handleThemeChange = () => {
        setDarkMode(prevMode => !prevMode);
        localStorage.setItem('darkMode', !darkMode);
    };

    const lightTheme = createTheme({
        palette: { mode: 'light' },
    });

    const darkTheme = createTheme({
        palette: { mode: 'dark' },
    });

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh',background: darkMode ? 'linear-gradient(180deg, #000000, white)' : 'linear-gradient(180deg, #3874cb, white)'}}>
                {/* Navbar */}
                <AppBar 
                position="fixed" 
                sx={{
                  backgroundColor: darkMode? '#000000':'#3874cb',
                  color: 'white',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                }}>
                    <Toolbar>
                        <FlashOnIcon sx={{ mr: 2 }} />
                        <Button color="inherit" href="/" sx={{ ml: 2 }}>
                            Flashcards SaaS
                        </Button>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                        <Switch checked={darkMode} onChange={handleThemeChange} />
                        <Button color="inherit" href="/flashcards" sx={{ ml: 2 }}>
                            Home
                        </Button>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <Button color="inherit" href="/sign-in">
                                Login
                            </Button>
                        </SignedOut>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Container
                    maxWidth="sm"
                    sx={{ 
                      textAlign: 'center', 
                      mt: 8, 
                      padding: 4, 
                      background:'transparent' }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <CircularProgress />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Loading...
                            </Typography>
                        </Box>
                    ) : error ? (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="h6" color="error">
                                {error}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {session.payment_status === 'paid' ? (
                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                    <Typography variant="h4">Thank you for your purchase!</Typography>
                                    <Box sx={{ mt: 2}}>
                                        <Typography variant="body1">
                                            We have received your payment. You will receive an email with the order details shortly.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                    <Typography variant="h4">Payment failed</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body1">
                                            Your payment was not successful. Please try again later.
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}
