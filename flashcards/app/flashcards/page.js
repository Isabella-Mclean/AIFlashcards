'use client';
import { useUser,SignedIn, SignedOut, UserButton, } from "@clerk/nextjs";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import db from '@/firebase';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box, Paper, AppBar, Toolbar, Button, Switch, CssBaseline, ThemeProvider } from '@mui/material';
import { FlashOn as FlashOnIcon, Person as PersonIcon } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      // If the user isn't signed in then send them back to the home page
      if (isLoaded && !isSignedIn) {
        return router.push('/');
      }
      // Check if the doc/user exists
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Get all collection names from doc
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        // Create the user account
        await setDoc(docRef, { flashcards: [] });
      }
    }
    if (isLoaded && isSignedIn && user) {
      getFlashcards();
    }
  }, [user, isSignedIn, router, isLoaded]);

  // If the user signs out while on the page
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleThemeChange = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
            sx={{background: darkMode ? 'linear-gradient(180deg, #000000, white)' : 'linear-gradient(180deg, #3874cb, white)'}}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
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
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url(/flashcardsBackground.png)', // Use your desired background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pt: 8, // Adjust padding-top to accommodate the fixed navbar
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {/* Heading Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Your Flashcard Collections
            </Typography>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Typography variant="body1">
                Below are your flashcard collections. Click on a collection to view the flashcards within it. You can create and manage your collections from your profile.
              </Typography>
            </Paper>
          </Box>

          {/* Flashcards Grid */}
          <Grid container spacing={4}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
                <Card className="feature-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      </Box>
    </ThemeProvider>
  );
}
