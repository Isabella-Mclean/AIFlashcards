'use client';
import { useUser, SignedIn, SignedOut, UserButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box, AppBar, Toolbar, Button, Switch } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import db from '@/firebase';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        async function getFlashcard() {
            if (!isSignedIn) {
                router.push('/');
            }

            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        if (isLoaded && isSignedIn && user) {
            getFlashcard();
        }
    }, [search, user, isSignedIn, router, isLoaded]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

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
            <Box sx={{ background: darkMode ? 'linear-gradient(180deg, #000000, white)' : 'linear-gradient(180deg, #3874cb, white)' }}>
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
                        <Button color="inherit" href="/generate" sx={{ ml: 2 }}>
                            Generate
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
                    maxWidth="md"
                    sx={{
                        padding: 4,
                        bgcolor:'transparent'
                    }}>
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {flashcards.map((flashcard) => (
                            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                                <Card className="feature-card" sx={{
                                    bgcolor: darkMode ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.6)', 
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
                                    transition: 'background-color 0.3s', 
                                    '&:hover': {
                                        bgcolor: darkMode ? 'rgba(33, 33, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)' // Darker shade on hover
                                    }}}>
                                    <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                        <CardContent>
                                            <Box sx={{ /* Optional: Styling for flip animation */ }}>
                                                {flipped[flashcard.id] ? (
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
