import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { useState } from 'react'



export default function Component() {
    const { data: session } = useSession()


    if (session) {
      
        return (
          <>
            <header>
              <a href="../">ReminDR</a>
              <div id="connect">
                <button onClick={() => signOut()}>Sign out</button>
                <img id='pp' src={session.user.image} title={session.user.name}></img>
              </div>
            </header>
  
            <div id='content'>
              <div id='lestitre'>
                <h1 id='titre'>Remindr</h1>
              </div>
            </div>
          </>
        )
      }
      return (
        <>
          <header>
            <a href="#">ReminDR</a>
              <div id="connect">
              <button onClick={() => signIn()}>Sign in</button>
              <img></img>
            </div>
          </header>
          <div id='content'>
            <div id='lestitre'>
              <h1 id='titre'>Remindr</h1>
            </div>
          </div>
        </>
      )
}