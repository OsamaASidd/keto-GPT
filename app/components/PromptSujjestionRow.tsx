import PromptSuggestionButton from "./PrompSuggestionButton"

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
             <PromptSuggestionButton
                key = {`suggestion-${index}`} 
                text={prompt} 
                onClick = {() => onPromptClick(prompt)}
             /> )}    
        </div>
    )
}

export default PromptSuggestionRow