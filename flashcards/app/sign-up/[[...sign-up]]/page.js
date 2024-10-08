'use client'
import { SignUp } from "@clerk/nextjs";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";

export default function Page() {

  return (
    <Container 
    sx={{
        maxWidth: "70vw", // Set the max-width to 70% of the viewport width
        padding: "0 16px", // Optional padding to maintain some space inside the container
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="p" component="h1" gutterBottom>
          Access your flashcards and start learning instantly.
        </Typography>
        <SignUp
          appearance={{
            elements: {
              card: {
                boxShadow: "none",
                backgroundColor: "transparent",
              },
              formButtonPrimary: {
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              },
            },
          }}
        />
      </Box>
    </Container>
  );
}