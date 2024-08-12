import * as React from 'react';
import Head from 'next/head';
import { Container,Typography,Box,Button,Grid,AppBar,Toolbar,Card, CardContent } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export default function Home() {
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
        <Button color="inherit">Pricing</Button>
        <Button color="inherit" href="/sign-in">Login</Button>
        <Button color="inherit" variant="outlined" sx={{ ml: 2 }} href="/sign-up">
          Sign Up
        </Button>
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
        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
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
                  Access your flashcards on the go, whether you're on your phone, tablet, or computer.
                </Typography>
              </CardContent>
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
