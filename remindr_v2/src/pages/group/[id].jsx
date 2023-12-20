import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {

    const session = await getServerSession(context.req, context.res, authOptions);
    const idGroup = context.params.id;
    
    if (session == null) {
      return { props: { group: null }}
    }
    const current_group = await prisma.group.findUnique({ 
      where: { id: idGroup },
      include : {
        users: true
      }
    });

    const list_rappel = await prisma.rappel.findMany({
      where: {
        id_group: idGroup
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    return { props: { group: current_group, rappels: JSON.parse(JSON.stringify(list_rappel))}}
  }

export default function Page({group, rappels}) {
    const { data: session } = useSession();
    const router = useRouter()

    //input value for add user in group
    const [inputValueEmail, setInputValueEmail] = useState("");

    //input value for add rappel
    const [inputValueName, setInputValueTitle] = useState('');
    const [inputValueDate, setInputValueDate] = useState('');
    const [inputValueDesc, setInputValueDesc] = useState('');
    const [inputValueColor, setInputValueColor] = useState('');  

    //handle set email
    const handleInputChangeEmail = (event) => {
        setInputValueEmail(event.target.value);
    }
    //handle add user in group
    const handleButtonAdd_user = async () => {

        const res = await fetch('/api/group/add_user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email : inputValueEmail, id: group.id}),
        });
        router.reload();
    };

    //handle set title rappel
    const handleInputChangeName = (event) => {
      setInputValueTitle(event.target.value);
    };

    //handle set date rappel
    const handleInputChangeDate = (event) => {
      setInputValueDate(event.target.valueAsDate);
    };

    //handle set desc rappel
    const handleInputChangeDesc = (event) => {
      setInputValueDesc(event.target.value);
    };

    //handle set color rappel
    const handleInputChangeColor = (event) => {
      setInputValueColor(event.target.value);
    };

    //handle add rappel
    const handleButtonAdd_rappel = async () => {
      const res = await fetch('/api/remind/add_remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: group.id, name: inputValueName, date: inputValueDate, desc: inputValueDesc, color: inputValueColor}),
      });
      router.reload();
    };

    if(session) {
        return (
            <>
            <head>
              <title>ReminDR - {group.name}</title>
            </head>


            <header>
              <a href="../">ReminDR</a>
              <h1>{group.name}</h1>
              <div id="connect">
                <button onClick={() => signOut()}>Sign out</button>
                <img id='pp' src={session.user.image} title={session.user.name}></img>
              </div>
            </header>

            <div id='content'>
              <div>
                  <h3>{group.desc}</h3>
              </div>

              <div id="user_list">
                  <h2>Utilisateurs :</h2>
                  <ul>
                  {
                      group.users.map((user) => {
                          return (
                                  <li>{user.name}</li>
                          )
                      })
                  }
                  </ul>
              </div>

              <div id="rappel_list">
                <h2>Rappels :</h2>
                  {
                    rappels.map((item) => {
                      return (
                        <div class="group_card" style={{backgroundColor:item.color}}>
                          <h1>{item.name}</h1>
                          <p>{item.desc}</p>
                          <p>{( new Date(item.date)).toLocaleDateString()}</p>
                        </div>
                    )})
                  }
              </div>
              
              <div id='add_rappel'>
                <h2>Ajouter un rappel :</h2>
                  <input type="text" value={inputValueName} onChange={handleInputChangeName} placeholder='Titre'/>
                  <input type="date" onChange={handleInputChangeDate} />
                  <input type="text" value={inputValueDesc} onChange={handleInputChangeDesc} placeholder='Description'/>
                  <input type="color" value={inputValueColor} onChange={handleInputChangeColor} />
                  <button onClick={handleButtonAdd_rappel}>+</button>
              </div>

              <div id="add_user">
                  <h2>Ajouter un utilisateur :</h2>
                  <form>
                      <input type="email" value={inputValueEmail} onChange={handleInputChangeEmail} placeholder="email" />
                      <button onClick={handleButtonAdd_user}>+</button>
                  </form>
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
              <h2>Veuiller vous connecter</h2>
            </div>
          <div id="contener_boutonConnect">
            <button id='boutonConnect' onClick={() => signIn()}>Sign in</button>
          </div>

          </div>
        </>
      )
}