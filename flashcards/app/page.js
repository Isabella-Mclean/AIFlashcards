'use client'

import * as React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Button, Grid, AppBar, Toolbar, Card, CardContent } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { SignedOut, SignedIn, UserButton,useUser } from '@clerk/nextjs';
import getStripe from '@/utils/get-stripejs';
import { useRouter } from 'next/navigation';


export default function Home(){
  //Handles when the user presses to upgrade to a pro account
  const handleSubmit = async () => {
    //Testing using dynamic origins
     //replacing headers: { origin: 'http://localhost:3000' }, with headers: { origin: currentOrigin },
    const currentOrigin = window.location.origin; // dynamically get the current origin
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: currentOrigin },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  // Inside your component function
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <>
      <Head>
        <title>Flashcards SaaS</title>
        <meta name="description" content="Create flashcards from text instantly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <FlashOnIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flashcards SaaS
          </Typography>
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
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Transform Your Text into Powerful Flashcards
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            Enhance your learning by generating flashcards from any text in seconds.
          </Typography>
          <Button variant="contained" color="primary" size="large" onClick={handleGetStarted}  sx={{ mt: 3 }} >
            Get Started for Free
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    AI-Powered Conversion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically generate flashcards from any text input using advanced AI algorithms.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Easy Customization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Edit and organize flashcards to fit your personal learning preferences and goals.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Multi-Device Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access your flashcards on the go, whether you are on your phone, tablet, or computer.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8, backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  Free Version
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Access basic features for personal use.
                </Typography>
                <Typography variant="h6" component="div" sx={{ my: 2 }}>
                  $0 / month
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  - Generate up to 50 flashcards per month
                  <br />
                  - Limited customization options
                  <br />
                  - Basic support
                </Typography>
                <Button variant="outlined" color="primary" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  Pro Version
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Unlock advanced features for power users.
                </Typography>
                <Typography variant="h6" component="div" sx={{ my: 2 }}>
                  $10 / month
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
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Upgrade to Pro
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
  );
}
