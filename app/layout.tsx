import "./global.css"

export const metadata = {
    title: "KETO GPT",
    description: "KETO GPT is a GPT-3 powered AI that helps you generate keto recipes and knowledge.",
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout