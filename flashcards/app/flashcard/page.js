'use client';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import db from '@/firebase';


export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const router = useRouter();

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            //If the user isn't signed in then send them back the home page
            if (!search || isSignedIn || !user) {
                router.push('/');
            }
            
            //Collect the flashcards from the firebase
            const colRef = collection(doc(collection(db, 'users'), user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);
        }
        getFlashcard();
    }, [search, user]);

    //Flips the flashcards when they are clicked
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
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
    );
}
