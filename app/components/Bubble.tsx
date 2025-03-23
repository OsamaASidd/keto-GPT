const Bubble = ({ message }) => {
    const { content, role } = message
    const formattedContent = role === 'assistant' ? formatAssistantResponse(content) : content
    return(
        <div className={`${role} bubble`}>
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
    )
}

export default Bubble


function formatAssistantResponse(rawResponse) {
    // Split the raw response into lines
    const lines = rawResponse.split('\n');

    // Initialize an array to hold the formatted HTML
    let formattedContent = [];
    let listType = null; // Keeps track of the current list type ('ul' for unordered, 'ol' for ordered)

    lines.forEach(line => {
        // Trim any leading or trailing whitespace
        line = line.trim();

        // Check if the line is a bullet point
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (listType !== 'ul') {
                if (listType) {
                    formattedContent.push('</ol>'); // Close previous ordered list
                }
                formattedContent.push('<ul>');
                listType = 'ul';
            }
            formattedContent.push(`<li>${line.slice(2)}</li>`);
        }
        // Check if the line is a numbered list item
        else if (/^\d+\. /.test(line)) {
            if (listType !== 'ol') {
                if (listType) {
                    formattedContent.push('</ul>'); // Close previous unordered list
                }
                formattedContent.push('<ol>');
                listType = 'ol';
            }
            formattedContent.push(`<li>${line.slice(line.indexOf(' ') + 1)}</li>`);
        }
        // Check if the line is a paragraph
        else if (line) {
            if (listType) {
                formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
                listType = null;
            }
            formattedContent.push(`<p>${line}</p>`);
        }
    });

    // Close any open list tags
    if (listType) {
        formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    // Join the formatted content into a single string
    let result = formattedContent.join('');

    // Format bold text
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return result;
}
