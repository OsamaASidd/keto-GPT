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
    const lines = rawResponse.split('\n');
    const formattedContent = [];
    let listType = null;

    lines.forEach(line => {
        line = line.trim();

        // Handle list items
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (listType !== 'ul') {
                if (listType) {
                    formattedContent.push('</ol>');
                }
                formattedContent.push('<ul>');
                listType = 'ul';
            }
            formattedContent.push(`<li>${line.slice(2)}</li>`);
        } else if (/^\d+\. /.test(line)) {
            if (listType !== 'ol') {
                if (listType) {
                    formattedContent.push('</ul>');
                }
                formattedContent.push('<ol>');
                listType = 'ol';
            }
            formattedContent.push(`<li>${line.slice(line.indexOf(' ') + 1)}</li>`);
        } else if (line) {
            if (listType) {
                formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
                listType = null;
            }
            // Special handling for embedded hyperlink with dynamic dish name
            if (line.includes('Click here to see nutrition score')) {
                const match = line.match(/nutrition\?dish=([^")]+)/); // Updated regex to exclude quotes and parentheses
                if (match) {
                    const dishName = match[1].trim();
                    line = line.replace(
                        'Click here to see nutrition score', 
                        `<a href="/nutrition?dish=${encodeURIComponent(dishName)}">Click here to see nutrition score</a>`
                    );
                }
            }
            formattedContent.push(`<p>${line}</p>`);
        }
    });

    if (listType) {
        formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    let result = formattedContent.join('');

    // Remove all content within parentheses that contains nutrition URLs
    result = result.replace(
        /\(\s*(?:https?:\/\/keto-gpt-1\.vercel\.app|http:\/\/localhost:3000)\/nutrition\?dish=[^)]+\s*\)/g, 
        ""
    );

    return result;
}