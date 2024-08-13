'use client';
import { useUser } from "@clerk/nextjs";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import db from '@/firebase';
import { Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material'


export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
       //If the user isn't signed in then send them back the home page
      if (!isSignedIn) {
        router.push('/');
      }
      // Check to see if the doc/user exists
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
    getFlashcards();
  }, [user]);

  // If the user signs out while on the page
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}


