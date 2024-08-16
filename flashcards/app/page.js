'use client'

import * as React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Button, Grid, AppBar, Toolbar, Card, CardContent, Switch } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import db from '@/firebase';
import getStripe from '@/utils/get-stripejs';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [darkMode, setDarkMode] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);

    async function addAccountStatus() {
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { flashcards: [], accountStatus: "FREE" });
      }
    } if (isLoaded && isSignedIn) {
      addAccountStatus();
    }
  }, [isSignedIn, isLoaded, user]);

  const handleSubmit = async () => {
    if (!isSignedIn) {
      return router.push('/sign-in');
    }

    const currentOrigin = window.location.origin;
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: currentOrigin },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px 20px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            backgroundColor: '#3874cb',
            paddingLeft: '10%',
            paddingRight: '10%',
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px 20px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#3874cb',
            paddingLeft: '10%',
            paddingRight: '10%',
          },
        },
      },
    },
  });

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/flashcards');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <>
        <Head>
          <title>Flashcards SaaS</title>
          <meta name="description" content="Create flashcards from text instantly" />
          <link rel="icon" href="/favicon2.png" />
        </Head>

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Flashcards SaaS
            </Typography>
            <Switch checked={darkMode} onChange={handleThemeChange} />
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" variant="outlined" sx={{ ml: 2 }} href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box 
          sx={{
            py: 10,
            background: darkMode ? 'linear-gradient(180deg, #000000, white)' : 'linear-gradient(180deg, #3874cb, white)',
            textAlign: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Container maxWidth="md">
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 700, color: darkMode? 'black':'white' }}>
              Transform Your Text into Powerful Flashcards
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, color: darkMode? 'black':'white'}}>
              Enhance your learning by generating flashcards from any text in seconds.
            </Typography>
            <Button variant="contained" color="primary" size="large" onClick={handleGetStarted} sx={{ px: 5, backgroundColor: darkMode? 'white' :'3874cb'}}>
              Get Started for Free
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Box 
          sx={{ 
            my: 5,
            py: 5,
            borderRadius: '6px',
            maxWidth: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center', 
                mb: 4, 
                fontWeight: 700,
              }}
            >
              Features
            </Typography>
            <Carousel
              showArrows={true}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
              interval={6000}
              swipeable={true} 
              dynamicHeight={false} 
              emulateTouch={true} 
              centerMode={false} 
              centerSlidePercentage={100} 
            >
              
                <Card className="feature-card"
                  sx={{
                    borderRadius: '31px',
                    boxShadow: darkMode ? '0px 2px 10px rgba(255, 255, 255, 0.8)' : '0px 4px 20px rgba(0, 0, 0, 0.8)',
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(56, 116, 203, 0.2)',
                    border: 'none', 
                    marginY:'2%',
                    marginX:'8%',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                      AI-Powered Conversion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automatically generate flashcards from any text input using advanced AI algorithms. The system is designed to intelligently extract key concepts and information from your text, transforming them into concise and effective flashcards that help you retain information better.
                    </Typography>
                  </CardContent>
                </Card>
              
              
                <Card className="feature-card"
                  sx={{
                    borderRadius: '31px',
                    boxShadow: darkMode ? '0px 2px 10px rgba(255, 255, 255, 0.8)' : '0px 4px 20px rgba(0, 0, 0, 0.8)',
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(56, 116, 203, 0.2)',
                    border: 'none', 
                    marginY:'2%',
                    marginX:'8%',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                      Easy Customization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edit and organize flashcards to fit your personal learning preferences and goals. With our easy-to-use interface, you can quickly adjust the content, format, and organization of your flashcards to match your study needs.
                    </Typography>
                  </CardContent>
                </Card>
              
              
                <Card className="feature-card"
                  sx={{
                    borderRadius: '31px',
                    boxShadow: darkMode ? '0px 2px 10px rgba(255, 255, 255, 0.8)' : '0px 4px 20px rgba(0, 0, 0, 0.8)',
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(56, 116, 203, 0.2)',
                    border: 'none', 
                    marginY:'2%',
                    marginX:'8%',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                      Multi-Device Access
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access your flashcards on the go, whether you are on your phone, tablet, or computer. Our platform is designed to be fully responsive, ensuring that you can review your flashcards wherever you are, on any device.
                    </Typography>
                  </CardContent>
                </Card>
              
            </Carousel>
          </Container>
        </Box>



        {/* Pricing Section */}
        <Box sx={{ py: 8, backgroundColor: 'white' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 700, color:'black' }}>
              Pricing
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Card className="feature-card" sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                    Free Version
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Access basic features for personal use.
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ my: 2, fontWeight: 700 }}>
                    $0
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    - Generate up to 50 flashcards per month
                    <br />
                    - Limited customization options
                    <br />
                    - Basic support
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={handleGetStarted} sx={{ px: 5, backgroundColor: darkMode? 'white' :'3874cb'}}>
                    Get Started
                  </Button>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card className="feature-card"  sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                    Pro Version
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Unlock advanced features for power users.
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ my: 2, fontWeight: 700 }}>
                    $10
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    - Unlimited flashcard generation
                    <br />
                    - Full customization options
                    <br />
                    - Priority support
                    <br />
                    - Access to new features
                  </Typography>
                  {/**Button to upgrade not working for now, it can be reinstated when pro features are complete
                  <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ px: 5, backgroundColor: darkMode? 'white' :'3874cb'}}>
                  Upgrade to Pro
                  </Button>*/}
                  <Button variant="contained" color="primary" sx={{ px: 5, backgroundColor: darkMode? 'white' :'3874cb'}}>
                    Coming Soon
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid #e0e0e0', mt: 8 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Flashcards SaaS. All rights reserved.
          </Typography>
        </Box>
      </>
    </ThemeProvider>
  );
}
