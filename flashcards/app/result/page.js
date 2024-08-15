'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import db from '@/firebase';
import { useUser } from '@clerk/nextjs';

//This page is for when a user (tries to) submit a payment via stripe
//They will receive a message on the page, depending on whether the payment is successful or not
export default function Result() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
    const { isSignedIn,user,isLoaded } = useUser();
    
    const setAccountStatus = async () => {
      if(isSignedIn){
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          await setDoc(docRef, {accountStatus:"PRO"},{merge:true});
        }
      }
    }

    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
               // Only attempt to update account status if the session is loaded and payment is successful
               if (isLoaded && sessionData.payment_status === "paid") {
                await setAccountStatus();
              }
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession();
      }, [session_id,isLoaded])

      if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
      }
      if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        )
      }
      return (
        <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
          {session.payment_status === 'paid' ? (
            <>
              {/**If the payment is successful */}
              <Typography variant="h4">Thank you for your purchase!</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  We have received your payment. You will receive an email with the
                  order details shortly.
                </Typography>
              </Box>
            </>
          ) : (
            <>
              {/** If the payment is not sucessful */}
              <Typography variant="h4">Payment failed</Typography>
              <Box sx={{mt: 2}}>
                <Typography variant="body1">
                  Your payment was not successful. Please try again later.
                </Typography>
              </Box>
            </>
          )}
        </Container>
      )
}
