'use client';
import { useUser } from "@clerk/nextjs";
import { collection, doc, setDoc, getDoc, writeBatch } from "firebase/firestore";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Container, Grid, Card, CardContent, Typography, CardActionArea, TextField, Box, Button, Modal } from '@mui/material';
import db from '@/firebase';

export default function Generate() {
    const { user, isSignedIn } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    if (!isSignedIn || !user) {
        router.push('/');
    }

    const handleSubmit = async () => {

        await fetch('/api/generate', {
            method: 'POST',
            body: JSON.stringify({ text }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data || []));
    };

    const handleSave = async () => {
        if (!name.trim()) return alert("Please provide a name for your flashcard collection");

        const batch = writeBatch(db);

        const userDocRef = doc(collection(db, 'users'), user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const collections = userDocSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert("A flashcard collection with that name already exists.");
                return;
            }else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        // Create a new collection for this flashcard set under the user's document
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

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text to generate flashcards"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
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
                                <Card>
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
        </Container>
    );
}
