import PromptSuggestionButton from "./PrompSuggestionButton"

const PromptSuggestionRow = (onPromptClick) => {
    const prompts = 
    [
        "What are the benefits of Keto Diet?",
        "What are the side effects of Keto Diet?",
        "What are the best foods for Keto Diet?",
        "What are some easy Keto Diet recipes?",
        "Tell me about nutrition scores for keto foods"
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

export default PromptSuggestionRow