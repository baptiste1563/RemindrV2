import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'




export default function Page({list_group}) {
    const { data: session } = useSession()


    if (session) {
      console.log(list_group)
      
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

              <div id="group_list">
              {
                  list_group.map((item) => {
                    return (
                      <div class="group_card">
                        <a href={"/group/" + item.id}>{item.name}</a>
                      </div>
                    )})
              }
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



export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/group/', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });
  const list_group = await res.json()
  return { props: { list_group }}
}



