'use client';
import { useUser, SignedIn, SignedOut, UserButton, SignUpButton } from "@clerk/nextjs";
import { collection, doc, setDoc, getDoc, writeBatch } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Container, Grid, Card, CardContent, Typography, CardActionArea, TextField, Box, Button, Modal, AppBar, Toolbar, Switch, Paper } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import db from '@/firebase';

export default function Generate() {
    const { user, isSignedIn,isLoaded} = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isSignedIn, user, router]);

    const handleSubmit = async () => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: JSON.stringify({ text }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setFlashcards(data || []);
    };

    const handleSave = async () => {
        if (!name.trim()) return alert("Please provide a name for your flashcard collection");

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const collections = userDocSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("A flashcard collection with that name already exists.");
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        setModalOpen(false);
        router.push('/flashcards');
    };

    const handleFlip = (index) => {
        setFlipped(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const handleThemeChange = () => {
        setDarkMode(!darkMode);
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
            <Box
            sx={{background: darkMode ? 'linear-gradient(180deg, #000000, white)' : 'linear-gradient(180deg, #3874cb, white)'}}>
            {/* Navbar */}
            <AppBar position="fixed" 
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
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
            sx={{mt:8,
                padding:6,
            }}>
                {/* AI Explanation Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        AI-Powered Flashcard Generation
                    </Typography>
                    <Paper elevation={3} sx={{ p: 3, bgcolor: darkMode ? 'background.default' : 'white' }}>
                        <Typography variant="body1" gutterBottom>
                            Enter a few words or a passage from your textbook, and let our AI do the rest! Our system analyes the text and generates flashcards that help you study more effectively. Whether you're learning vocabulary, historical facts, or complex concepts, our AI can create the perfect set of flashcards tailored to your needs.
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Simply input your text in the box below, click "Generate Flashcards," and review the generated cards. You can save your flashcards to your account for future use.
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Be aware it takes about 10 seconds to generate, so please do not close the page!
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text to generate flashcards"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ bgcolor: darkMode ? 'background.default' : 'white' }}
                    />
                    <Button variant="contained" color="primary" sx={{ mt:2, px: 5, backgroundColor: darkMode? 'white' :'3874cb'}} onClick={handleSubmit}>
                        Generate Flashcards
                    </Button>
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Preview Flashcards
                        </Typography>
                        <Grid container spacing={4}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card className="feature-card" sx={{
                                    bgcolor: darkMode ? 'rgba(33, 33, 33, 0.8)' : 'rgba(255, 255, 255, 0.6)', 
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
                                    transition: 'background-color 0.3s', 
                                    '&:hover': {
                                        bgcolor: darkMode ? 'rgba(33, 33, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)' // Darker shade on hover
                                    }}}>
                                        <CardActionArea onClick={() => handleFlip(index)}>
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {flipped[index] ? flashcard.back : flashcard.front}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Click to flip
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Button variant="contained" color="secondary" sx={{ mt: 4 }} onClick={() => setModalOpen(true)}>
                            Save to Firebase
                        </Button>
                    </Box>
                )}

                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Save Flashcards
                        </Typography>
                        <TextField
                            fullWidth
                            label="Collection Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ bgcolor: darkMode ? 'background.default' : 'white' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                </Modal>

                {/* Sign-Up Section */}
                <SignedOut>
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Sign Up to Save Your Flashcards!
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                            Create an account to save and access your flashcards anytime, anywhere.
                        </Typography>
                        <Paper elevation={3} sx={{ display: 'inline-block', p: 3, bgcolor: darkMode ? 'background.paper' : 'white' }}>
                            <SignUpButton mode="modal">
                                <Button variant="contained" color="primary">
                                    Sign Up Now
                                </Button>
                            </SignUpButton>
                        </Paper>
                    </Box>
                </SignedOut>

                {/* Footer or Additional Info Section */}
                <Box sx={{ mt: 8, textAlign: 'center', py: 4, borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.12)' : '#ddd'}` }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Flashcards SaaS. All rights reserved.
                    </Typography>
                </Box>
            </Container>
            </Box>
        </ThemeProvider>
    );
}
