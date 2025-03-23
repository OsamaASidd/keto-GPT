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

    const  formattedContent = [];
    let listType = null; 

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (listType !== 'ul') {
                if (listType) {
                    formattedContent.push('</ol>');
                }
                formattedContent.push('<ul>');
                listType = 'ul';
            }
            formattedContent.push(`<li>${line.slice(2)}</li>`);
        }
        else if (/^\d+\. /.test(line)) {
            if (listType !== 'ol') {
                if (listType) {
                    formattedContent.push('</ul>');
                }
                formattedContent.push('<ol>');
                listType = 'ol';
            }
            formattedContent.push(`<li>${line.slice(line.indexOf(' ') + 1)}</li>`);
        }
        else if (line) {
            if (listType) {
                formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
                listType = null;
            }
            formattedContent.push(`<p>${line}</p>`);
        }
    });

    if (listType) {
        formattedContent.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    const  result = formattedContent.join('');

    return result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');;
}
