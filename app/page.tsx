"use client"

import Image from "next/image"
import logo from "./assets/logo.png"

import { useChat } from "ai/react"
import { Message } from "ai"

import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"


const PromptSuggestionRow = (onPromptClick) => {
    const prompts = 
    [
        "What are the benefits of Keto Diet?",
        "What are the side effects of Keto Diet?",
        "What are the best foods for Keto Diet?",
        "What are some easy Keto Diet recipes?",
    ]
    return(
        <div className="prompt-suggestion-row">
              {prompts.map((prompt, index) =>
             <button className="prompt-suggestion-button" onClick={() => onPromptClick(prompt)} key={`suggestion-${index}`} >
             {prompt}
            </button>
             )}    
              
        </div>
    )
}


const Home = () => {

    const { append, isLoading, messages, input , handleInputChange, handleSubmit } = useChat()


    const noMessages = !messages || messages.length === 0


    const handlePrompt = ( promptText: string ) => {
        const msg: Message= {
            id : crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }

    
    return (
        <main>
            <Image src={logo} width="250" alt= "Food Logo"/>
            <section className = {noMessages ? "" : "populated" }>
                {
                    noMessages ? (
                        <>
                        <p className="starter-text"> 
                            The Ultimate place to find the best knowledge for your keto diet!
                            Ask Keto GPT anything and it will come back with the most up-to-date answers.
                            We hope you enjoy !
                        </p>
                        <br/>
                        {PromptSuggestionRow(handlePrompt)}
                        </>
                    ) : (
                        <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`}  message={message} />)} 
                        {isLoading && <LoadingBubble/>}
                        </>
                    )
                }
            <form onSubmit={ handleSubmit }>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me anything about keto!"/>
                <input type= "submit"/>
            </form>
            </section>

        </main>
    )
}

export default Home