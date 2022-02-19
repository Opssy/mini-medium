import { useState, useRef, useEffect } from 'react' // new
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'

/**import contract address and contract owner address */
import  { contractAddress } from '../config'

import Blog from '../artifacts/contracts/blog.sol/Blog.json'

/* define the ipfs endpoint */
const client = create('https://ipfs.infura.io:5001/api/v0')

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(
    () => import('react-simplemde-editor'),
    {ssr: false }
)

const initialState = { title: '', content: ''}

function CreatePost() {
   /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState)
  const [image, setImage] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const fileRef = useRef(null)
  const { title, content } = post
  const router = useRouter() 

  useEffect(() => {
      setTimeout(() => {
         /**delay rendering buttons until dynamic import is complete */
        setLoaded(true)
      }, 500)
  }, [])
  function onChange(e) {
      setPost(() => ({...post, [e.target.name]: e.target.value}))
  }
  async function createNewPost(){
       /* saves post to ipfs then anchors to smart contract */
       if(!title || !content) return
       const hash = await savePostToIpfs()
       await savePost(hash)
       router.push(`/`) 
  } 
}